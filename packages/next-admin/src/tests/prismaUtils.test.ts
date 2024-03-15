import { Decimal } from "@prisma/client/runtime/library";
import { getMappedDataList, isSatisfyingSearch } from "../utils/prisma";
import { options, prismaMock } from "./singleton";
import { Prisma } from "@prisma/client";

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
      asJson: false,
    });

    expect(result).toEqual({
      data: postData,
      total: postData.length,
      error: null,
    });
  });

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

    const result = await getMappedDataList({
      prisma: prismaMock,
      resource: "Post",
      options,
      searchParams: new URLSearchParams(),
      context: {},
      appDir: false,
      asJson: true,
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

describe("isSatisfyingSearch", () => {
  const fieldsFiltered =
    Prisma.dmmf.datamodel.models
      .find((model) => model.name === "Post")
      ?.fields.filter(({ name }) => ["title", "content"].includes(name)) ?? [];

  it("should return true if the search is satisfying", () => {
    const search = "test";
    const data = {
      id: 1,
      title: "Test",
      content: "Test",
      published: true,
    };

    expect(isSatisfyingSearch(data, fieldsFiltered, search)).toBe(true);
  });

  it("should return false if the search is not satisfying", () => {
    const search = "not matching";
    const data = {
      id: 1,
      title: "Test",
      content: "Test",
      published: true,
    };
    expect(isSatisfyingSearch(data, fieldsFiltered, search)).toBe(false);
  });

  it("should return true if the search matches the _formatted field", () => {
    const search = "formatted test";
    const data = {
      id: 1,
      title: "Test",
      content: "Test",
      published: true,
      _formatted: "formatted test",
    };
    expect(isSatisfyingSearch(data, fieldsFiltered, search, true)).toBe(true);
  });
});
