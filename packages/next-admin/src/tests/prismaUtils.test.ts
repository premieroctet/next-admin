import { Decimal } from "@prisma/client/runtime/library";
import cloneDeep from "lodash.clonedeep";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";
import {
  getMappedDataList,
  optionsFromResource,
  selectPayloadForModel,
} from "../utils/prisma";
import { extractSerializable } from "../utils/tools";
import { options, prismaMock } from "./singleton";

const idFieldOverride = vi.hoisted(() => ({
  value: undefined as boolean | undefined,
}));

vi.mock("../utils/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/server")>();
  return {
    ...actual,
    modelHasIdField: (model: Parameters<typeof actual.modelHasIdField>[0]) =>
      idFieldOverride.value ?? actual.modelHasIdField(model),
  };
});

describe("getMappedDataList", () => {
  it("should return the data list, total and error", async () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
        order: 0,
        tags: [],
        images: [],
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
        order: 1,
        tags: [],
        images: [],
      },
    ];
    const originalPostData = cloneDeep(postData);

    prismaMock.post.findMany.mockResolvedValue(postData);

    prismaMock.post.count.mockResolvedValue(2);

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams: new URLSearchParams(),
      context: {},
      appDir: false,
    });

    expect(result).toEqual({
      data: postData,
      total: postData.length,
      error: null,
      rawData: originalPostData.map(() => ({})),
    });
  });

  describe("related rows in rawData", () => {
    const post = {
      id: 1,
      title: "Post 1",
      authorId: 1,
      author: {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        hashedPassword: "secret-hash",
      },
    };

    const applySelect = (row: any, select: Record<string, any>): any =>
      Object.fromEntries(
        Object.entries(select)
          .filter(([key]) => key in row)
          .map(([key, value]) => [
            key,
            value?.select ? applySelect(row[key], value.select) : row[key],
          ])
      );

    const getRawData = async (appDir: boolean, listFields = {}) => {
      prismaMock.post.findMany.mockImplementation(
        (args: any) => [applySelect(post, args.select)] as any
      );
      prismaMock.post.count.mockResolvedValue(1);

      const { rawData } = await getMappedDataList({
        prisma: prismaMock,
        resource: "Post",
        options: {
          model: {
            Post: { list: { display: ["author"], fields: listFields } },
          },
        },
        searchParams: new URLSearchParams(),
        context: {},
        appDir,
      });

      return rawData;
    };

    it("should not send related rows to the client in the app router", async () => {
      expect(await getRawData(true)).toBeUndefined();
    });

    it("should not send related rows without a formatter in the page router", async () => {
      expect(JSON.stringify(await getRawData(false))).not.toContain(
        "secret-hash"
      );
    });

    it("should keep related rows read by a page router formatter", async () => {
      const rawData = await getRawData(false, {
        author: { formatter: (author: any) => author.name },
      });

      expect(rawData).toEqual([{ author: extractSerializable(post.author) }]);
    });
  });

  afterEach(() => {
    mockReset(prismaMock);
  });
});

describe("optionsFromResource", () => {
  it("should return the data list as an enumeration", async () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
        order: 0,
        tags: [],
        images: [],
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
        order: 1,
        tags: [],
        images: [],
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(postData);

    prismaMock.post.count.mockResolvedValue(2);

    const result = await optionsFromResource({
      prisma: prismaMock,
      originResource: "User",
      property: "posts",
      resource: "Post",
      options,
      searchParams: new URLSearchParams(),
      context: {},
      appDir: false,
    });

    expect(result).toEqual({
      data: postData.map((post) =>
        expect.objectContaining({
          label: post.title,
          value: post.id,
        })
      ),
      total: postData.length,
      error: null,
    });
  });

  afterEach(() => {
    mockReset(prismaMock);
  });
});

describe("selectPayloadForModel", () => {
  it("should not select to-many relations at scalar level", () => {
    const select = selectPayloadForModel("User", {}, "scalar");

    expect(select.posts).toBeUndefined();
    expect(select.id).toBe(true);
    expect(select.email).toBe(true);
  });

  it("should select relations with only their scalar fields at object level", () => {
    const select = selectPayloadForModel(
      "User",
      { display: ["posts", "profile"] } as any,
      "object"
    );

    expect(select.posts).toEqual(
      expect.objectContaining({
        select: expect.objectContaining({ id: true, title: true }),
      })
    );
    expect(select.posts.select.categories).toBeUndefined();
  });

  it("should select the far side of explicit many-to-many join rows", () => {
    const select = selectPayloadForModel(
      "Post",
      { display: ["categories"] },
      "object"
    );

    expect(select.categories.select.category).toBe(true);
  });

  it("should fetch a to-many relation of a related row requested with a dotted dependsOn", () => {
    const select = selectPayloadForModel(
      "Post",
      {
        display: [
          "author",
          {
            key: "authorPostCount",
            label: "Author posts",
            dependsOn: ["author.posts"],
            formatter: ({ row }) =>
              String(row?.author.posts?.map((post) => post.title).length),
          },
        ],
      },
      "object"
    );

    expect(select.author.select.posts).toBe(true);
    expect(select.author.select.name).toBe(true);
  });

  it("should use include for a dotted dependsOn on a relation absent from display", () => {
    const select = selectPayloadForModel(
      "Post",
      {
        display: [
          {
            key: "authorCategories",
            label: "Author categories",
            dependsOn: ["author.posts.categories", "title"],
            formatter: () => "",
          },
        ],
      },
      "object"
    );

    expect(select.author).toEqual({
      include: { posts: { include: { categories: true } } },
    });
    expect(select.title).toBe(true);
  });

  it("should select the whole relation when a dotted dependsOn ends on a scalar", () => {
    const select = selectPayloadForModel(
      "Post",
      {
        display: [
          {
            key: "authorName",
            label: "Author name",
            dependsOn: ["author.name"],
            formatter: () => "",
          },
        ],
      },
      "object"
    );

    expect(select.author).toBe(true);
  });

  it("should keep a dotted dependsOn when the to-one relation is displayed at scalar level", () => {
    const select = selectPayloadForModel("Post", {
      display: [
        "author",
        {
          key: "authorPosts",
          label: "Author posts",
          dependsOn: ["author.posts"],
          formatter: () => "",
        },
      ],
    });

    expect(select.author).toEqual({ include: { posts: true } });
  });

  it("should keep virtual field dependencies for models without a single id field", () => {
    idFieldOverride.value = false;
    try {
      const select = selectPayloadForModel(
        "CategoriesOnPosts",
        {
          display: [
            {
              key: "postAuthor",
              label: "Post author",
              dependsOn: ["post.author"],
              formatter: () => "",
            },
          ],
        },
        "object"
      );

      expect(select.id).toBeUndefined();
      expect(select.post).toEqual({ include: { author: true } });
    } finally {
      idFieldOverride.value = undefined;
    }
  });
});
