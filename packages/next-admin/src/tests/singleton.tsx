// https://www.prisma.io/docs/guides/testing/unit-testing#singleton
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import React from "react";

import prisma from "@prisma/client";
import { NextAdminOptions, Schema } from "../types";
import { getJsonSchema } from "../utils/server";

jest.mock("@prisma/client", () => ({
  __esModule: true,
  Prisma: {
    __typename: "Prisma",
    SortOrder: {
      __typename: "SortOrder",
      asc: "asc",
      desc: "desc",
    },
  },
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

export const schema = getJsonSchema();

export const options: NextAdminOptions = {
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      list: {
        display: ["id", "name", "email", "posts", "role"],
        search: ["name", "email"],
      },
      edit: {
        display: ["id", "name", "email", "posts", "role", "birthDate"],
        fields: {
          email: {
            validate: (email) => email.includes("@") || "Invalid email",
            input: <input type="email" />,
          },
          birthDate: {
            format: "date",
          },
        },
      },
    },
    Post: {
      toString: (post) => `${post.title}`,
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
      },
    },
    Category: {
      toString: (category) => `${category.name}`,
    },
  },
};
