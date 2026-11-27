import { afterEach, describe, expect, test } from "vitest";
import { mockReset } from "vitest-mock-extended";
import { NextAdminOptions } from "../types";
import { prismaMock } from "../tests/singleton";
import { createWherePredicate, getMappedDataList } from "./prisma";

const options: NextAdminOptions = {
  model: {
    Post: {
      list: {
        search: ["title", "author.name", "author.email", "author.posts.title"],
      },
    },
  },
};

describe("Prisma utils", () => {
  afterEach(() => {
    mockReset(prismaMock);
  });

  test("createWherePredicate", () => {
    expect(
      createWherePredicate({
        resource: "Post",
        options,
        search: "test",
      })
    ).toEqual({
      AND: [
        {
          OR: [
            { title: { contains: "test" } },
            {
              author: {
                OR: [
                  {
                    name: {
                      contains: "test",
                    },
                  },
                  {
                    email: {
                      contains: "test",
                    },
                  },
                  {
                    posts: {
                      some: {
                        OR: [
                          {
                            title: {
                              contains: "test",
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test("getMappedDataList with sort parameters", async () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        authorId: 1,
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: false,
        authorId: 2,
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(postData);
    prismaMock.post.count.mockResolvedValue(2);

    const searchParams = new URLSearchParams({
      sortColumn: "title",
      sortDirection: "asc",
    });

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams,
      context: {},
      appDir: false,
    });

    expect(result.data).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.error).toBeNull();

    // Verify that findMany was called with orderBy parameter
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({ title: "asc" }),
      })
    );
  });

  test("getMappedDataList with desc sort direction", async () => {
    const postData = [
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: false,
        authorId: 2,
      },
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        authorId: 1,
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(postData);
    prismaMock.post.count.mockResolvedValue(2);

    const searchParams = new URLSearchParams({
      sortColumn: "title",
      sortDirection: "desc",
    });

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams,
      context: {},
      appDir: false,
    });

    expect(result.data).toBeDefined();
    expect(result.total).toBe(2);
    expect(result.error).toBeNull();

    // Verify that findMany was called with orderBy parameter
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({ title: "desc" }),
      })
    );
  });

  test("getMappedDataList with invalid sort direction falls back to default", async () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        authorId: 1,
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(postData);
    prismaMock.post.count.mockResolvedValue(1);

    const searchParams = new URLSearchParams({
      sortColumn: "title",
      sortDirection: "invalid" as any,
    });

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams,
      context: {},
      appDir: false,
    });

    expect(result.data).toBeDefined();
    expect(result.total).toBe(1);
    expect(result.error).toBeNull();

    // Should fallback to sorting by id when invalid sort direction is provided
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({ id: "asc" }),
      })
    );
  });

  test("getMappedDataList with undefined sort direction falls back to default", async () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        content: "Content 1",
        published: true,
        authorId: 1,
      },
    ];

    prismaMock.post.findMany.mockResolvedValue(postData);
    prismaMock.post.count.mockResolvedValue(1);

    // Simulate clicking on a column header without sortDirection set yet
    const searchParams = new URLSearchParams({
      sortColumn: "title",
    });

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams,
      context: {},
      appDir: false,
    });

    expect(result.data).toBeDefined();
    expect(result.total).toBe(1);
    expect(result.error).toBeNull();

    // Should fallback to sorting by id when sortDirection is undefined
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({ id: "asc" }),
      })
    );
  });
});
