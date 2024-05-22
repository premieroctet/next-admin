import { prisma } from "@/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  const csv = users.map((user) => {
    return `${user.id},${user.name},${user.email},${user.role},${user.birthDate}`;
  });

  const headers = new Headers();
  headers.set("Content-Type", "text/csv");
  headers.set("Content-Disposition", `attachment; filename="users.csv"`);

  return new Response(csv.join("\n"), {
    headers,
  });
}
