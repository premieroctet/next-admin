// https://www.prisma.io/docs/guides/testing/unit-testing#singleton
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import prisma from "@prisma/client";
import { NextAdminOptions, Schema } from "../types";

jest.mock("@prisma/client", () => ({
  __esModule: true,
  Prisma: {
    __typename: "Prisma",
    dmmf: {
      __typename: "DMMF",
      datamodel: {
        __typename: "DMMF",
        models: [
          {
            name: "User",
            dbName: null,
            fields: [
              {
                name: "id",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "Int",
                default: { name: "autoincrement", args: [] },
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "email",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: true,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "name",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "posts",
                kind: "object",
                isList: true,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "Post",
                relationName: "PostToUser",
                relationFromFields: [],
                relationToFields: [],
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "createdAt",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "DateTime",
                default: { name: "now", args: [] },
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "updatedAt",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "DateTime",
                default: { name: "now", args: [] },
                isGenerated: false,
                isUpdatedAt: true,
              },
              {
                name: "birthDate",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "DateTime",
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            primaryKey: null,
            uniqueFields: [],
            uniqueIndexes: [],
            isGenerated: false,
          },
          {
            name: "Post",
            dbName: null,
            fields: [
              {
                name: "id",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "Int",
                default: { name: "autoincrement", args: [] },
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "title",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "content",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "published",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "Boolean",
                default: false,
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "author",
                kind: "object",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "User",
                relationName: "PostToUser",
                relationFromFields: ["authorId"],
                relationToFields: ["id"],
                isGenerated: false,
                isUpdatedAt: false,
              },
              {
                name: "authorId",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: true,
                hasDefaultValue: false,
                type: "Int",
                isGenerated: false,
                isUpdatedAt: false,
              },
            ],
            primaryKey: null,
            uniqueFields: [],
            uniqueIndexes: [],
            isGenerated: false,
          },
        ],
      },
    },
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
