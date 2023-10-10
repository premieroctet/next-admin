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

export default function Admin(props: AdminComponentProps) {
  return (
    <NextAdmin
      {...props}
      dashboard={Dashboard}
      options={{
        model: {
          User: {
            list: {
              fields: {
                role: {
                  formatter: (role) => {
                    return <strong>{role.toString()}</strong>;
                  },
                },
              },
            },
          },
          Post: {
            list: {
              fields: {
                author: {
                  formatter: (author) => {
                    return <strong>{`${author.name} - ${author.email}`}</strong>;
                  },
                }
              }
            }
          }
        },
      }}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { nextAdminRouter } = await import(
    "@premieroctet/next-admin/dist/router"
  );

  const options: NextAdminOptions = {
    basePath: "/admin",
    model: {
      User: {
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
            author: {
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

  const adminRouter = await nextAdminRouter(prisma, schema, options);
  return adminRouter.run(req, res) as Promise<
    GetServerSidePropsResult<{ [key: string]: any }>
  >;
};
