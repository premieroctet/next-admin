import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";
import JsonEditor from "./components/JsonEditor";

export const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "👥 Users",
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
                .split(" ")[0];
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
        fields: {
          email: {
            validate: (email) => email.includes("@") || "Invalid email",
            format: "email",
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
                  return true
                }
                JSON.parse(value as string)
                return true
              } catch {
                return "Invalid JSON"
              }
            }
          }
        },
      },
      actions: [
        {
          title: "Send email",
          action: async (...args) => {
            "use server";
            const { submitEmail } = await import("./actions/nextadmin");
            await submitEmail(...args);
          },
          successMessage: "Email sent successfully",
          errorMessage: "Error while sending email",
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
        fields: {
          content: {
            format: 'richtext-html'
          }
        },
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
