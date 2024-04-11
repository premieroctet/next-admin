import { Decimal } from "@prisma/client/runtime/library";
import { getMappedDataList, optionsFromResource } from "../utils/prisma";
import { options, prismaMock } from "./singleton";

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
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
      },
    ];

    prismaMock.post.findMany.mockResolvedValueOnce(postData);

    prismaMock.post.count.mockResolvedValueOnce(2);

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
    });
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
      },
      {
        id: 2,
        title: "Post 2",
        content: "Content 2",
        published: true,
        author: 1,
        authorId: 1,
        rate: new Decimal(5),
      },
    ];

    prismaMock.post.findMany.mockResolvedValueOnce(postData);

    prismaMock.post.count.mockResolvedValueOnce(2);

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
      data: postData.map((post) => ({
        label: post.title,
        value: post.id,
      })),
      total: postData.length,
      error: null,
    });
  });
});
