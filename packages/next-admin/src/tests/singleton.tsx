// https://www.prisma.io/docs/guides/testing/unit-testing#singleton
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import React from "react";

import prisma from "@prisma/client";
import { NextAdminOptions, Schema } from "../types";

jest.mock("@prisma/client", () => ({
  __esModule: true,
  Prisma: {
    __typename: "Prisma",
    dmmf: jest.requireActual("@prisma/client").Prisma.dmmf,
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

export const schema: Schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  definitions: {
    User: {
      properties: {
        id: { $ref: "#/definitions/Post" },
        name: { type: "string" },
        email: { type: "string" },
        role: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        birthDate: { type: "string", format: "date-time" },
      },
    },
    Post: {
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        published: { type: "boolean" },
        author: { $ref: "#/definitions/User" },
        authorId: { type: "integer" },
      },
    },
    Category: {
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    Profile: {
      properties: {
        id: { type: "string" },
        bio: { type: "string" },
        user: { $ref: "#/definitions/User" },
        userId: { type: "integer" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    post_comment: {
      type: "object",
      properties: {
        id: { type: "string" },
        content: { type: "string" },
        post: { $ref: "#/definitions/Post" },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
        },
      },
      required: ["content", "postId"],
    },
  },
};

export const options: NextAdminOptions = {
  basePath: "/admin",
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
          "authorId",
          "categories",
        ],
      },
    },
    Category: {
      toString: (category) => `${category.name}`,
    },
  },
};
