import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";

export const options: NextAdminOptions = {
  title: "⚡️ My Admin",

  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      permissions: ["edit", "delete", "create"],
      title: "Users",
      icon: "UsersIcon",
      aliases: {
        id: "ID",
        name: "Full name",
        birthDate: "Date of birth",
      },
      list: {
        exports: {
          format: "CSV",
          url: "/api/users/export",
        },
        display: [
          "id",
          "name",
          "email",
          "posts",
          "role",
          "birthDate",
          "profile",
        ],
        search: ["name", "email", "role"],
        copy: ["email"],
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
        ],
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
          _form: "grid-cols-3 gap-4 md:grid-cols-4",
          id: "col-span-2 row-start-1",
          name: "col-span-2 row-start-1",
          "email-notice": "col-span-4 row-start-3",
          email: "col-span-4 md:col-span-2 row-start-4",
          posts: "col-span-4 md:col-span-2 row-start-5",
          role: "col-span-4 md:col-span-3 row-start-6",
          birthDate: "col-span-3 row-start-7",
          avatar: "col-span-4 row-start-8",
          metadata: "col-span-4 row-start-9",
        },
        fields: {
          name: {
            required: true,
          },
          email: {
            validate: (email) => email.includes("@") || "form.user.email.error",
            helperText: "Must be a valid email address",
            tooltip: "Make sure to include the @",
          },
          birthDate: {
            input: <DatePicker />,
          },
          posts: {
            display: "list",
            orderField: "order",
          },
          avatar: {
            format: "file",
            handler: {
              /*
               * Include your own upload handler here,
               * for example you can upload the file to an S3 bucket.
               * Make sure to return a string.
               */
              upload: async (buffer, infos) => {
                return "https://raw.githubusercontent.com/premieroctet/next-admin/33fcd755a34f1ec5ad53ca8e293029528af814ca/apps/example/public/assets/logo.svg";
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
          id: "submit-email",
          title: "actions.user.email.title",
          action: async (ids) => {
            console.log("Sending email to " + ids.length + " users");
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
      permissions: ["edit", "delete", "create"],
      list: {
        exports: [
          { format: "CSV", url: "/api/posts/export?format=csv" },
          { format: "JSON", url: "/api/posts/export?format=json" },
        ],
        display: [
          "id",
          "title",
          "published",
          "author",
          "categories",
          "rate",
          "tags",
        ],
        search: ["title", "content", "tags"],
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
        fields: {
          content: {
            format: "richtext-html",
          },
          categories: {
            relationOptionFormatter: (category) => {
              return `${category.name} Cat.${category.id}`;
            },
            display: "list",
            orderField: "order",
            relationshipSearchField: "category",
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
          "tags",
        ],
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
        fields: {
          posts: {
            display: "list",
            relationshipSearchField: "post",
          },
        },
      },
    },
    Profile: {
      title: "Profiles",
      icon: "UserIcon",
      list: {
        display: ["id", "user"],
      },
      edit: {
        display: ["user", "bio"],
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
        models: ["User", "Profile"],
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
    {
      label: "Page Router",
      url: "/pagerouter/admin",
    },
  ],
  defaultColorScheme: "dark",
};
