import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";

export const options: NextAdminOptions = {
  basePath: "/pagerouter/admin",
  apiBasePath: "/api/admin",
  title: "⚡️ My Admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "Users",
      icon: "UsersIcon",
      list: {
        display: ["id", "name", "email", "posts", "role", "birthDate"],
        search: ["name", "email"],
        filters: [
          {
            name: "is Admin",
            active: false,
            value: {
              role: {
                equals: "ADMIN",
              },
            },
          },
          {
            name: "over 18",
            value: {
              birthDate: {
                lte: (() => {
                  const date = new Date();
                  date.setFullYear(date.getFullYear() - 18);
                  return date;
                })(),
              },
            },
          },
        ],
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
        ],
        styles: {
          _form: "grid-cols-3 gap-2 md:grid-cols-4",
          id: "col-span-2",
          name: "col-span-2 row-start-2",
          email: "col-span-2 row-start-3",
          posts: "col-span-2 row-start-4",
          role: "col-span-2 row-start-4",
          birthDate: "col-span-3 row-start-5",
          avatar: "col-span-1 row-start-5",
          metadata: "col-span-4 row-start-6",
        },
        fields: {
          name: {
            required: true,
          },
          email: {
            validate: (email) => email.includes("@") || "Invalid email",
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
              upload: async (file: File) => {
                return "https://www.gravatar.com/avatar/00000000000000000000000000000000";
              },
            },
          },
        },
      },
      actions: [
        {
          title: "Send email",
          action: async (model, ids) => {
            const response = await fetch("/api/email", {
              method: "POST",
              body: JSON.stringify(ids),
            });

            if (!response.ok) {
              throw new Error("Failed to send email");
            }
          },
          successMessage: "Email sent successfully",
          errorMessage: "Error while sending email",
        },
      ],
    },
    Post: {
      toString: (post) => `${post.title}`,
      title: "Posts",
      icon: "NewspaperIcon",
      list: {
        display: ["id", "title", "published", "author", "categories"],
        search: ["title"],
        fields: {
          author: {
            formatter: (author) => {
              return <strong>{author.name}</strong>;
            },
          },
          published: {
            formatter: (value: boolean) => {
              return value ? "Published" : "Unpublished";
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
          "author",
          "categories",
        ],
        fields: {
          content: {
            format: "richtext-html",
          },
        },
      },
    },
    Category: {
      title: "Categories",
      icon: "InboxStackIcon",
      toString: (category) => `${category.name}`,
      list: {
        display: ["name", "posts"],
      },
      edit: {
        display: ["name", "posts"],
      },
    },
  },
  pages: {
    "/custom": {
      title: "Custom page",
      icon: "AdjustmentsHorizontalIcon",
    },
  },
  sidebar: {
    groups: [
      {
        title: "Users",
        models: ["User"],
      },
      {
        title: "Categories",
        models: ["Category"],
      },
    ],
  },
};
