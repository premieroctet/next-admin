import AddTagDialog from "@/components/PostAddTagDialogContent";
import UserDetailsDialog from "@/components/UserDetailsDialogContent";
import { NextAdminOptions } from "@premieroctet/next-admin";
import DatePicker from "./components/DatePicker";
import PasswordInput from "./components/PasswordInput";
import { prisma } from "./prisma";

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
        newPassword: "Password",
      },
      list: {
        exports: {
          format: "CSV",
          url: "/api/users/export",
        },
        display: ["id", "name", "email", "posts", "role", "birthDate"],
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
          {
            name: "@premieroctet.com",
            active: false,
            value: {
              email: {
                endsWith: "@premieroctet.com",
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
                ?.toLocaleString(context?.locale ?? "en")
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
          "newPassword",
        ],
        styles: {
          _form: "grid-cols-3 gap-4 md:grid-cols-4",
          id: "col-span-2 row-start-1",
          name: "col-span-2 row-start-1",
          "email-notice": "col-span-4 row-start-2",
          email: "col-span-4 md:col-span-2 row-start-3",
          newPassword: "col-span-3 row-start-4",
          posts: "col-span-4 md:col-span-2 row-start-5",
          role: "col-span-4 md:col-span-3 row-start-6",
          birthDate: "col-span-3 row-start-7",
          avatar: "col-span-4 row-start-8",
          metadata: "col-span-4 row-start-9",
        },
        fields: {
          name: {
            required: true,
            validate: (name) =>
              (name && name.length > 2) || "form.user.name.error",
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
              upload: async (buffer, infos, context) => {
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
        customFields: {
          newPassword: {
            input: <PasswordInput />,
            required: true,
          },
        },
        hooks: {
          beforeDb: async (data, mode, request) => {
            const newPassword = data.newPassword;
            if (newPassword) {
              data.hashedPassword = `hashed-${newPassword}`;
            }

            return data;
          },
        },
      },
      actions: [
        {
          type: "server",
          id: "submit-email",
          icon: "EnvelopeIcon",
          title: "actions.user.email.title",
          action: async (ids) => {
            console.log("Sending email to " + ids.length + " users");
            return {
              type: "success",
              message: "Email sent successfully",
            };
          },
          successMessage: "actions.user.email.success",
          errorMessage: "actions.user.email.error",
        },
        {
          type: "dialog",
          icon: "EyeIcon",
          canExecute: (item) => item.role === "ADMIN",
          id: "user-details",
          title: "actions.user.details.title",
          component: <UserDetailsDialog />,
          depth: 3,
        },
      ],
    },
    Post: {
      toString: (post) => `${post.title}`,
      title: "Posts",
      icon: "NewspaperIcon",
      permissions: ["edit", "delete", "create"],
      actions: [
        {
          type: "server",
          id: "publish",
          icon: "CheckIcon",
          title: "actions.post.publish.title",
          action: async (ids) => {
            console.log("Publishing " + ids.length + " posts");
            await prisma.post.updateMany({
              where: {
                id: {
                  in: ids.map((id) => Number(id)),
                },
              },
              data: {
                published: true,
              },
            });
            return {
              type: "success",
              message: "actions.post.publish.success",
            };
          },
          successMessage: "actions.post.publish.success",
          errorMessage: "actions.post.publish.error",
        },
        {
          type: "dialog",
          icon: "TagIcon",
          id: "add-tag",
          title: "actions.post.add-tag.title",
          component: <AddTagDialog />,
        },
      ],
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
        filters: [
          {
            name: "Published",
            active: false,
            value: {
              published: true,
            },
          },
          {
            name: "Unpublished",
            active: false,
            value: {
              published: false,
            },
          },
          async function byCategoryFilters() {
            const categories = await prisma.category.findMany({
              select: { id: true, name: true },
              take: 5,
            });

            return categories.map((category) => ({
              name: category.name,
              value: { categories: { some: { id: category.id } } },
              active: false,
              group: "by_category_id",
            }));
          },
        ],
        search: ["title", "content", "tags", "author.name"],
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
        hooks: {
          async beforeDb(data, mode, request) {
            console.log("intercept beforedb", data, mode, request);

            return data;
          },
          async afterDb(response, mode, request) {
            console.log("intercept afterdb", response, mode, request);

            return response;
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
        fields: {
          posts: {
            display: "list",
            relationshipSearchField: "post",
            orderField: "order",
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
