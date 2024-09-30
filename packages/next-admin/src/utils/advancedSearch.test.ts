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
          type: ["string", "null"],
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
        testBool: {
          type: "boolean",
        },
        testNull: {
          type: ["string", "null"],
        },
        testArray: {
          type: "array",
          items: {
            type: "string",
          },
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
        not: null,
        in: ["test", "test2"],
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
          },
        },
        {
          test3: {
            some: {
              test2: {
                equals: "test",
              },
            },
          },
        },
        {
          OR: [
            {
              test5: {
                test6: {
                  contains: "test",
                },
              },
            },
          ],
        },
      ],
      testBool: {
        equals: true,
      },
      testNull: {
        equals: null,
      },
      testArray: {
        has: "test",
      },
    };

    const expected: UIQueryBlock[] = [
      {
        type: "filter",
        path: "test",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[0]",
        nullable: true,
        displayPath: "test",
      },
      {
        type: "filter",
        path: "test",
        condition: "nnull",
        value: null,
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[1]",
        nullable: true,
        displayPath: "test",
      },
      {
        type: "filter",
        path: "test",
        condition: "in",
        value: "test, test2",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[2]",
        nullable: true,
        displayPath: "test",
      },
      {
        type: "filter",
        path: "test2",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[3]",
        nullable: false,
        displayPath: "test2",
      },
      {
        type: "filter",
        path: "test5.test6",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[4]",
        nullable: false,
        displayPath: "test5 → test6",
      },
      {
        type: "filter",
        path: "test5.some",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[5]",
        nullable: false,
        displayPath: "test5 → some",
      },
      {
        type: "and",
        id: "1",
        internalPath: "[6]",
        children: [
          {
            type: "filter",
            path: "test3.test",
            condition: "contains",
            value: "test",
            contentType: "text",
            id: "1",
            canHaveChildren: false,
            internalPath: "[6].children[0]",
            nullable: false,
            displayPath: "test3 → test",
          },
          {
            type: "filter",
            path: "test3.test2",
            condition: "equals",
            value: "test",
            contentType: "text",
            id: "1",
            canHaveChildren: false,
            internalPath: "[6].children[1]",
            nullable: false,
            displayPath: "test3 → test2",
          },
          {
            type: "or",
            id: "1",
            internalPath: "[6].children[2]",
            children: [
              {
                type: "filter",
                path: "test5.test6",
                condition: "contains",
                value: "test",
                contentType: "text",
                id: "1",
                canHaveChildren: false,
                internalPath: "[6].children[2].children[0]",
                nullable: false,
                displayPath: "test5 → test6",
              },
            ],
          },
        ],
      },
      {
        type: "filter",
        path: "testBool",
        condition: "equals",
        value: true,
        contentType: "boolean",
        id: "1",
        canHaveChildren: false,
        internalPath: "[7]",
        nullable: false,
        displayPath: "testBool",
      },
      {
        type: "filter",
        path: "testNull",
        condition: "null",
        value: null,
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[8]",
        nullable: true,
        displayPath: "testNull",
      },
      {
        type: "filter",
        path: "testArray",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[9]",
        nullable: false,
        displayPath: "testArray",
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
        canHaveChildren: false,
        internalPath: "[0]",
        nullable: false,
        displayPath: "test2",
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
        not: null,
        in: ["test", "test2"],
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
          },
        },
        {
          test3: {
            some: {
              test2: {
                equals: "test",
              },
            },
          },
        },
        {
          OR: [
            {
              test5: {
                test6: {
                  contains: "test",
                },
              },
            },
          ],
        },
      ],
      testNull: {
        equals: null,
      },
      testArray: {
        has: "test",
      },
    };

    const base: UIQueryBlock[] = [
      {
        type: "filter",
        path: "test",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[0]",
        nullable: true,
      },
      {
        type: "filter",
        path: "test2",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[1]",
        nullable: false,
      },
      {
        type: "filter",
        path: "test5.test6",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[2]",
        nullable: false,
      },
      {
        type: "filter",
        path: "test5.some",
        condition: "contains",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[3]",
        nullable: false,
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
            canHaveChildren: false,
            internalPath: "[4].children[0]",
            nullable: false,
          },
          {
            type: "filter",
            path: "test3.test2",
            condition: "equals",
            value: "test",
            contentType: "text",
            id: "1",
            canHaveChildren: false,
            internalPath: "[4].children[1]",
            nullable: false,
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
                canHaveChildren: false,
                internalPath: "[4].children[2].children[0]",
                nullable: false,
              },
            ],
          },
        ],
      },
      {
        type: "filter",
        path: "testNull",
        condition: "null",
        value: null,
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[5]",
        nullable: true,
      },
      {
        type: "filter",
        path: "test",
        condition: "nnull",
        value: null,
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[6]",
        nullable: true,
      },
      {
        type: "filter",
        path: "test",
        condition: "in",
        value: "test, test2",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[7]",
        nullable: true,
      },
      {
        type: "filter",
        path: "testArray",
        condition: "equals",
        value: "test",
        contentType: "text",
        id: "1",
        canHaveChildren: false,
        internalPath: "[8]",
        nullable: false,
      },
    ];

    // @ts-expect-error
    const received = buildQueryBlocks(base, { resource: "Test", schema });

    expect(received).toEqual(expected);
  });
});
