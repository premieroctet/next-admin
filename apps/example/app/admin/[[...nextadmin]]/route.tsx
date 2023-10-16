import { NextAdminOptions, AdminComponentProps, AdminComponentOptions, ModelName, NextAdmin } from "@premieroctet/next-admin";
import { nextAdminRouter } from "@premieroctet/next-admin/dist/router";
import { prisma } from "../../../prisma";
import schema from "../../../prisma/json-schema/json-schema.json";

const optionsRouter: NextAdminOptions = {
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

const options: AdminComponentOptions<ModelName> = {
  model: {
    User: {
      list: {
        fields: {
          role: {
            formatter: (user) => {
              return <strong>{user.role as string} </strong>;
            },
          },
        },
      },
    },
  },
}

const handler = async (request: Request) => {

  const ReactDOMServer = await import("react-dom/server");

  const adminRouter = await nextAdminRouter(prisma, schema, optionsRouter);
  //@ts-expect-error
  const props = await adminRouter.run(request, null) as AdminComponentProps;

  const nextAdmin = NextAdmin({ ...props, options });

  const html = ReactDOMServer.renderToString(nextAdmin);

  const propsString = JSON.stringify(props);

  return new Response(propsString);

}


export { handler as GET, handler as POST }
