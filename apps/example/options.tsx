import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";
import JsonEditor from "./components/JsonEditor";

export const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "👥 Users",
      aliases: {
        id: "ID",
      },
      list: {
        display: ["id", "name", "email", "posts", "role", "birthDate"],
        search: ["name", "email"],
        fields: {
          role: {
            formatter: (role) => {
              return <strong>{role.toString()}</strong>;
            },
          },
          birthDate: {
            formatter: (date, context) => {
              return new Date(date as unknown as string)
                ?.toLocaleString(context?.locale)
                .split(/[\s,]+/)[0];
            },
          },
        },
      },
      edit: {
        display: [
          "id",
          "name",
          "email",
          "posts",
          "role",
          "birthDate",
          "avatar",
          "metadata"
        ],
        styles: {
          _form: 'grid-cols-3 gap-2 md:grid-cols-4',
          id: 'col-span-2',
          name: 'col-span-2 row-start-2',
          email: 'col-span-2 row-start-3',
          posts: 'col-span-2 row-start-4',
          role: 'col-span-2 row-start-4',
          birthDate: 'col-span-3 row-start-5',
          avatar: 'col-span-1 row-start-5',
          metadata: "col-span-4 row-start-6",
        },
        fields: {
          email: {
            validate: (email) => email.includes("@") || "form.user.email.error",
          },
          birthDate: {
            input: <DatePicker />,
          },
          avatar: {
            format: "file",
            handler: {
              /*
               * Include your own upload handler here,
               * for example you can upload the file to an S3 bucket.
               * Make sure to return a string.
               */
              upload: async (file: Buffer) => {
                return "https://www.gravatar.com/avatar/00000000000000000000000000000000";
              },
            },
          },
          metadata: {
            input: <JsonEditor />,
            validate: (value) => {
              try {
                if (!value) {
                  return true;
                }
                JSON.parse(value as string);
                return true;
              } catch {
                return "Invalid JSON";
              }
            },
          },
        },
      },
      actions: [
        {
          title: "actions.user.email.title",
          action: async (...args) => {
            "use server";
            const { submitEmail } = await import("./actions/nextadmin");
            await submitEmail(...args);
          },
          successMessage: "actions.user.email.success",
          errorMessage: "actions.user.email.error",
        },
      ],
    },
    Post: {
      toString: (post) => `${post.title}`,
      title: "📝 Posts",
      list: {
        display: [
          "id",
          "title",
          "content",
          "published",
          "author",
          "categories",
          "rate"
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
        fields: {
          content: {
            format: "textarea",
          },
          categories: {
            optionFormatter: (category) => `${category.name} Cat.${category.id}`,
          },
        },
        display: [
          "id",
          "title",
          "content",
          "published",
          "categories",
          "author",
          "rate"
        ],
      },
    },
    Category: {
      title: "📚 Categories",
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
  pages: {
    "/custom": {
      title: "Custom page",
    },
  },
};
