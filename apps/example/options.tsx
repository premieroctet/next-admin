import { NextAdminOptions } from "@premieroctet/next-admin";
import React from "react";
import InputDisplay from "./components/InputDisplay";

export const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "Users 👥",
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
          "createdAt",
        ],
        fields: {
          email: {
            validate: (email) => email.includes("@") || "Invalid email",
          },
          birthDate: {
            format: "date",
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
          createdAt: {
            // @ts-expect-error
            format: "string",
            input: <InputDisplay />,
          },
        },
      },
    },
    Post: {
      toString: (post) => `${post.title}`,
      title: "Posts 📝",
      list: {
        display: [
          "id",
          "title",
          "content",
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
      title: "Categories 📚",
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
};
