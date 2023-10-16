import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { prisma } from "../../prisma";
import schema from "../../prisma/json-schema/json-schema.json";
import "@premieroctet/next-admin/dist/styles.css";
import {
  AdminComponentProps,
  NextAdmin,
  NextAdminOptions,
} from "@premieroctet/next-admin";
import Dashboard from "../../components/Dashboard";

const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      list: {
        fields: {
          name: {
            search: true,
            display: true,
          },
          email: {
            search: true,
            display: true,
          },
          role: {
            search: true,
            display: true,
            formatter: (user) => {
              return <strong>{user.role as string}</strong>;
            },
          },
          posts: {
            search: true,
            display: true,
          },
        },
      },
      edit: {
        fields: {
          id: {
            display: true,
          },
          name: {
            display: true,
          },
          email: {
            display: true,
            validate: (email) => email.includes("@") || "Invalid email",
          },
          role: {
            display: true,
          },
          posts: {
            display: true,
          },
          profile: {
            display: true,
          },
        },
      },
    },
    Post: {
      toString: (post) => `${post.title}`,
      list: {
        fields: {
          id: {
            search: true,
            display: true,
          },
          title: {
            search: true,
            display: true,
          },
          content: {
            search: true,
            display: true,
          },
          published: {
            display: true,
          },
          authorId: {
            display: true,
          },
          categories: {
            display: true,
          },
        },
      },
    },
    Category: {
      toString: (category) => `${category.name}`,
    },
  },
};

export default function Admin(props: AdminComponentProps) {
  return (
    <NextAdmin
      {...props}
      dashboard={Dashboard}
      options={options}
    />
  );
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
