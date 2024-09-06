import { JSONSchema4 } from "json-schema";
import {
  buildQueryBlocks,
  buildUIBlocks,
  QueryBlock,
  UIQueryBlock,
} from "./advancedSearch";

// @ts-expect-error
jest.spyOn(global, "crypto", "get").mockImplementation(() => {
  return {
    randomUUID: () => "1",
  };
});

const schema: JSONSchema4 = {
  definitions: {
    Test: {
      properties: {
        test: {
          type: "string",
        },
        test2: {
          type: "string",
        },
        test3: {
          type: "array",
          items: {
            $ref: "#/definitions/Test3",
          },
        },
        test5: {
          $ref: "#/definitions/Test5",
        },
      },
    },
    Test3: {
      properties: {
        test: {
          type: "string",
        },
        test2: {
          type: "string",
        },
        test3: {
          type: "string",
        },
        test4: {
          type: "string",
        },
        test5: {
          type: "array",
          items: {
            $ref: "#/definitions/Test5",
          },
        },
      },
    },
    Test5: {
      properties: {
        test6: {
          type: "string",
        },
        some: {
          type: "string",
        },
      },
    },
  },
};

describe("advancedSearch", () => {
  it("should convert a query block to a UI query block", () => {
    const base: QueryBlock = {
      test: {
        contains: "test",
      },
      test2: {
        equals: "test",
      },
      test5: {
        test6: {
          contains: "test",
        },
        some: {
          contains: "test",
        },
      },
      AND: [
        {
          test3: {
            some: {
              test: {
                contains: "test",
              },
            },
          }
        },
        {
          test3: {
            some: {
              test2: {
                equals: "test",
              },
            },
          }
        },
        {
          OR: [
            {
              test5: {
                test6: {
                  contains: "test",
                }
              }
            }
          ]
        }
      ]
    };

    const expected: UIQueryBlock[] = [
      {
        type: "filter",
        path: "test",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test2",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test5.test6",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test5.some",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "and",
        id: "1",
        children: [
          {
            type: "filter",
            path: "test3.test",
            condition: "contains",
            value: "test",
            contentType: "text",
            id: "1",
          },
          {
            type: "filter",
            path: "test3.test2",
            condition: "equals",
            value: "test",
            contentType: "text",
            id: "1",
          },
          {
            type: "or",
            id: "1",
            children: [
              {
                type: "filter",
                path: "test5.test6",
                condition: "contains",
                value: "test",
                contentType: "text",
                id: "1",
              }
            ]
          }
        ],
      },
    ];

    // @ts-expect-error
    const result = buildUIBlocks(base, { resource: "Test", schema });

    expect(result).toEqual(expected);
  });

  it("should not include a some query that is not from an array field", () => {
    const base: QueryBlock = {
      test: {
        some: {
          test: {
            contains: "test",
          },
        },
      },
      test2: {
        equals: "test",
      },
    };

    const expected: UIQueryBlock[] = [
      {
        type: "filter",
        path: "test2",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
      },
    ];

    // @ts-expect-error
    const result = buildUIBlocks(base, { resource: "Test", schema });

    expect(result).toEqual(expected);
  });

  it("should convert UI query blocks to a query block", () => {
    const expected: QueryBlock = {
      test: {
        contains: "test",
      },
      test2: {
        equals: "test",
      },
      test5: {
        test6: {
          contains: "test",
        },
        some: {
          contains: "test",
        },
      },
      AND: [
        {
          test3: {
            some: {
              test: {
                contains: "test",
              },
            },
          }
        },
        {
          test3: {
            some: {
              test2: {
                equals: "test",
              },
            },
          }
        },
        {
          OR: [
            {
              test5: {
                test6: {
                  contains: "test",
                }
              }
            }
          ]
        }
      ]
    };

    const base: UIQueryBlock[] = [
      {
        type: "filter",
        path: "test",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test2",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test5.test6",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "filter",
        path: "test5.some",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
      },
      {
        type: "and",
        id: "1",
        children: [
          {
            type: "filter",
            path: "test3.test",
            condition: "contains",
            value: "test",
            contentType: "text",
            id: "1",
          },
          {
            type: "filter",
            path: "test3.test2",
            condition: "equals",
            value: "test",
            contentType: "text",
            id: "1",
          },
          {
            type: "or",
            id: "1",
            children: [
              {
                type: "filter",
                path: "test5.test6",
                condition: "contains",
                value: "test",
                contentType: "text",
                id: "1",
              }
            ]
          }
        ],
      },
    ];

    // @ts-expect-error
    const received = buildQueryBlocks(base, { resource: "Test", schema })

    expect(received).toEqual(
      expected
    );
  });
});
