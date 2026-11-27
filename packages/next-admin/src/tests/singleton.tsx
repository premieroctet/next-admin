// https://www.prisma.io/docs/guides/testing/unit-testing#singleton
import { beforeEach, vi } from "vitest";
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import type { PrismaClient as PrismaClientType } from "../types-prisma";

import prisma from "@prisma/client";
import { NextAdminOptions } from "../types";
import { getJsonSchema } from "../utils/server";

vi.mock("@prisma/client", () => ({
  __esModule: true,
  Prisma: {
    __typename: "Prisma",
    SortOrder: {
      __typename: "SortOrder",
      asc: "asc",
      desc: "desc",
    },
    PostScalarFieldEnum: {
      id: "id",
      title: "title",
      content: "content",
      published: "published",
      authorId: "authorId",
      order: "order",
      rate: "rate",
      tags: "tags",
      images: "images",
    },
    UserScalarFieldEnum: {
      id: "id",
      name: "name",
      email: "email",
      role: "role",
      birthDate: "birthDate",
      hashedPassword: "hashedPassword",
      avatar: "avatar",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      metadata: "metadata",
    },
    CategoryScalarFieldEnum: {
      id: "id",
      name: "name",
    },
  },
  default: mockDeep<PrismaClientType>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClientType>;

beforeEach(() => {
  mockReset(prismaMock);
});

export const schema = getJsonSchema();

export const options: NextAdminOptions = {
  // @ts-expect-error
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
