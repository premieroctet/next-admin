import { prisma } from "@/prisma";

const BATCH_SIZE = 1000;
export async function GET() {
  const headers = new Headers();
  headers.set("Content-Type", "text/csv");
  headers.set("Content-Disposition", `attachment; filename="users.csv"`);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const batchSize = BATCH_SIZE;
        let skip = 0;
        let users;
        do {
          users = await prisma.user.findMany({
            skip,
            take: batchSize,
          });
          const csv = users
            .map((user) => {
              return `${user.id},${user.name},${user.email},${user.role},${user.birthDate}\n`;
            })
            .join("");
          controller.enqueue(Buffer.from(csv));
          skip += batchSize;
        } while (users.length === batchSize);
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
