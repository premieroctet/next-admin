import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { prisma } from "../../prisma";
import schema from "./../../prisma/json-schema/json-schema.json";
import "@premieroctet/next-admin/dist/styles.css";
import {
  AdminComponentProps,
  NextAdmin,
  NextAdminOptions,
} from "@premieroctet/next-admin";
import Dashboard from "../../components/Dashboard";

export default function Admin(props: AdminComponentProps) {
  return <NextAdmin {...props} dashboard={Dashboard} options={{
    model: {
      user: {
        list: {
          fields: {
            role: {
              formatter: (user) => {
                return <strong>{user.role as string}</strong>;
              },
            }
          }
        }
      }
    }
  }} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { nextAdminRouter } = await import(
    "@premieroctet/next-admin/dist/router"
  );

  const options: NextAdminOptions = {
    model: {
      user: {
        toString: (user) => `${user.name} (${user.email})`,
        list: {
          fields: {
            id: {
              search: true,
              display: true,
            },
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
            },
            // @ts-expect-error Cannot get types for relationships
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
            },
            role: {
              display: true,
            },
            // @ts-expect-error Cannot get types for relationships
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
              search: true,
              display: true,
            },
            authorId: {
              search: true,
              display: true,
            },
            // @ts-expect-error Les types pour les relations ne peuvent pas être déterminés
            categories: {
              search: true,
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

  const adminRouter = await nextAdminRouter(prisma, schema, options);
  return adminRouter.run(req, res) as Promise<
    GetServerSidePropsResult<{ [key: string]: any }>
  >;
};
