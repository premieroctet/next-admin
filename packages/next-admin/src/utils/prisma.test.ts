import { describe, expect, test } from "vitest";
import { NextAdminOptions } from "../types";
import "../tests/singleton";
import { createWherePredicate, selectPayloadForModel } from "./prisma";

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

  test("selectPayloadForModel fetches relation data for dependsOn fields", () => {
    const options: NextAdminOptions = {
      model: {
        Post: {
          list: {
            display: [
              {
                key: "authorName",
                label: "Author name",
                type: "scalar",
                dependsOn: ["author"],
                formatter: ({ row }) => row?.author?.name ?? "",
              },
            ],
          },
        },
      },
      // @ts-expect-error
    };

    const select = selectPayloadForModel("Post", options.model!.Post!.list);

    expect(select).toMatchObject({
      author: {
        select: expect.objectContaining({ name: true, email: true }),
      },
    });
  });

  test("selectPayloadForModel fetches scalar dependsOn fields", () => {
    const options: NextAdminOptions = {
      model: {
        Post: {
          list: {
            display: [
              {
                key: "fullTitle",
                label: "Full title",
                type: "scalar",
                dependsOn: ["author", "title"],
                formatter: ({ row }) => `${row?.title}, by ${row?.author?.name}`,
              },
            ],
          },
        },
      },
      // @ts-expect-error
    };

    const select = selectPayloadForModel("Post", options.model!.Post!.list);

    expect(select).toMatchObject({ title: true });
  });

  test("selectPayloadForModel fetches nested dotted dependsOn fields", () => {
    const options: NextAdminOptions = {
      model: {
        User: {
          list: {
            display: [
              {
                key: "profileBio",
                label: "Profile bio",
                type: "scalar",
                dependsOn: ["profile.user"],
                formatter: ({ row }) => row?.profile?.user?.name ?? "",
              },
            ],
          },
        },
      },
      // @ts-expect-error
    };

    const select = selectPayloadForModel("User", options.model!.User!.list);

    expect(select).toMatchObject({
      profile: {
        select: {
          user: {
            select: expect.objectContaining({ name: true, email: true }),
          },
        },
      },
    });
  });

  test("selectPayloadForModel keeps dotted dependsOn when the relation is also displayed", () => {
    const options: NextAdminOptions = {
      model: {
        Post: {
          list: {
            display: [
              "author",
              {
                key: "authorBio",
                label: "Author bio",
                type: "scalar",
                dependsOn: ["author.profile.bio"],
                formatter: ({ row }) => row?.author?.profile?.bio ?? "",
              },
            ],
          },
        },
      },
      // @ts-expect-error
    };

    const select = selectPayloadForModel(
      "Post",
      options.model!.Post!.list,
      "object"
    );

    expect(select).toMatchObject({
      author: {
        select: {
          name: true,
          profile: {
            select: expect.objectContaining({ bio: true }),
          },
        },
      },
    });
  });
});
