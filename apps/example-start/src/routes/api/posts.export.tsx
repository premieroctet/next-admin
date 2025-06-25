import { createServerFileRoute } from "@tanstack/react-start/server";
import prisma from "../../prisma";

export const ServerRoute = createServerFileRoute("/api/posts/export").methods({
  GET: async ({ request, params }) => {
    const url = new URL(request.url);
    const format = url.searchParams.get("format");

    if (format === "csv") {
      const posts = await prisma.post.findMany();
      const csv = posts.map((post) => {
        return `${post.id},${post.title},${post.published},${post.authorId},${post.rate}`;
      });

      const headers = new Headers();
      headers.set("Content-Type", "text/csv");
      headers.set("Content-Disposition", `attachment; filename="posts.csv"`);

      return new Response(csv.join("\n"), {
        headers,
      });
    } else if (format === "json") {
      const posts = await prisma.post.findMany();
      return new Response(JSON.stringify(posts), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=posts.json",
        },
      });
    } else {
      return new Response("Unsupported format", { status: 400 });
    }
  },
});
