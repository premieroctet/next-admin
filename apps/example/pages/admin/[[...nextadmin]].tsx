import {
  AdminComponentProps,
  NextAdmin,
  NextAdminOptions,
} from "@premieroctet/next-admin";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Dashboard from "../../components/Dashboard";
import { prisma } from "../../prisma";
import schema from "../../prisma/json-schema/json-schema.json";

const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      list: {
        display: ["id", "name", "email", "posts", "role", "birthDate", "birthDate"],
        search: ["name", "email"],
        fields: {
          role: {
            formatter: (role) => {
              return <strong>{role.toString()}</strong>;
            },
          },
          birthDate: {
            formatter: (date) => {
              return new Date(date as unknown as string)
                ?.toLocaleString()
                .split(" ")[0];
            },
          },
        },
      },
      edit: {
        display: ["id", "name", "email", "posts", "role", "birthDate", "birthDate"],
        fields: {
          email: {
            validate: (email) => email.includes("@") || "Invalid email",
          },
          birthDate: {
            format: "date",
          },
        },
      },
    },
    Post: {
      toString: (post) => `${post.title}`,
      list: {
        display: [
          "id",
          "title",
          "content",
          "published",
          "author",
          "categories",
        ],
        search: ["title", "content"],
        fields: {
          author: {
            formatter: (author) => {
              return <strong>{author.name}</strong>;
            },
          },
        },
      },
      edit: {
        display: [
          "id",
          "title",
          "content",
          "published",
          "authorId",
          "categories",
        ],
      },
    },
    Category: {
      toString: (category) => `${category.name}`,
      list: {
        display: ["name", "posts"],
        search: ["name"],
      },
      edit: {
        display: ["name", "posts"],
      },
    },
  },
};

export default function Admin(props: AdminComponentProps) {
  return <NextAdmin {...props} dashboard={Dashboard} options={options} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { nextAdminRouter } = await import(
    "@premieroctet/next-admin/dist/router"
  );

  const adminRouter = await nextAdminRouter(prisma, schema, options);
  return adminRouter.run(req, res) as Promise<
    GetServerSidePropsResult<{ [key: string]: any }>
  >;
};
