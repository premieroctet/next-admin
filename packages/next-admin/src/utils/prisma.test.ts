import { NextAdminOptions } from "../types";
import { createWherePredicate } from "./prisma";

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
});
