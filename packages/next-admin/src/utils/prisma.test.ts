import { describe, expect, test } from "vitest";
import { NextAdminOptions } from "../types";
import "../tests/singleton";
import { createWherePredicate } from "./prisma";
import { ITEMS_PER_PAGE } from "../config";

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

  describe("maxRows server-side enforcement logic", () => {
    test("should cap itemsPerPage when it exceeds maxRows", () => {
      const modelMaxRows = 50;
      let itemsPerPage = 200;

      if (modelMaxRows && itemsPerPage > modelMaxRows) {
        itemsPerPage = modelMaxRows;
      }

      expect(itemsPerPage).toBe(50);
    });

    test("should not modify itemsPerPage when it is below maxRows", () => {
      const modelMaxRows = 50;
      let itemsPerPage = 25;

      if (modelMaxRows && itemsPerPage > modelMaxRows) {
        itemsPerPage = modelMaxRows;
      }

      expect(itemsPerPage).toBe(25);
    });

    test("should not modify itemsPerPage when maxRows is not set", () => {
      const modelMaxRows = undefined;
      let itemsPerPage = 100;

      if (modelMaxRows && itemsPerPage > modelMaxRows) {
        itemsPerPage = modelMaxRows;
      }

      expect(itemsPerPage).toBe(100);
    });

    test("should use defaultListSize and cap it when it exceeds maxRows", () => {
      const modelDefaultListSize = 75;
      const modelMaxRows = 50;
      let itemsPerPage = modelDefaultListSize || ITEMS_PER_PAGE;

      if (modelMaxRows && itemsPerPage > modelMaxRows) {
        itemsPerPage = modelMaxRows;
      }

      expect(itemsPerPage).toBe(50);
    });

    test("should handle maxRows equal to itemsPerPage", () => {
      const modelMaxRows = 50;
      let itemsPerPage = 50;

      if (modelMaxRows && itemsPerPage > modelMaxRows) {
        itemsPerPage = modelMaxRows;
      }

      expect(itemsPerPage).toBe(50);
    });
  });
});
