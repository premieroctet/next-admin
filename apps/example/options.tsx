import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";

export const options: NextAdminOptions = {
  basePath: "/admin",
  title: "⚡️ My Admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "Users",
      icon: "UsersIcon",
      aliases: {
        id: "ID",
      },
      list: {
        display: ["id", "name", "email", "posts", "role", "birthDate"],
        search: ["name", "email", "role"],
        copy: ["email"],
        fields: {
          role: {
            formatter: (role) => {
              return (
                <strong className="dark:text-white">{role.toString()}</strong>
              );
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
          {
            title: "Email is mandatory",
            id: "email-notice",
            description: "You must add an email from now on",
          } as const,
          "email",
          "posts",
          "role",
          "birthDate",
          "avatar",
          "metadata",
        ],
        styles: {
          _form: "grid-cols-3 gap-2 md:grid-cols-4",
          id: "col-span-2 row-start-1",
          name: "col-span-2 row-start-2",
          "email-notice": "col-span-4 row-start-3",
          email: "col-span-2 row-start-4",
          posts: "col-span-2 row-start-5",
          role: "col-span-2 row-start-6",
          birthDate: "col-span-3 row-start-7",
          avatar: "col-span-4 row-start-8",
          metadata: "col-span-4 row-start-9",
        },
        fields: {
          email: {
            validate: (email) => email.includes("@") || "form.user.email.error",
            helperText: "Must be a valid email address",
            tooltip: "Make sure to include the @",
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
            format: "json",
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
      title: "Posts",
      icon: "NewspaperIcon",
      list: {
        display: ["id", "title", "published", "author", "categories", "rate"],
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
            format: "richtext-html",
          },
          categories: {
            optionFormatter: (category) =>
              `${category.name} Cat.${category.id}`,
            display: "admin-list",
          },
        },
        display: [
          "id",
          "title",
          "content",
          "published",
          "categories",
          "author",
          "rate",
        ],
      },
    },
    Category: {
      title: "Categories",
      icon: "InboxStackIcon",
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
      icon: "PresentationChartBarIcon",
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
  externalLinks: [
    {
      label: "Documentation",
      url: "https://next-admin.js.org",
    },
  ],
  defaultColorScheme: "dark",
};
