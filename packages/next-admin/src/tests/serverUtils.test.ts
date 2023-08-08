import { fillRelationInSchema } from "../utils/server";
import { prismaMock, schema } from "./singleton";

describe("fillRelationInSchema", () => {
  it("should return the schema with the relation property", async () => {
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 1,
        email: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        birthDate: new Date(),
        role: "ADMIN",
      },
      {
        id: 2,
        email: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        birthDate: new Date(),
        role: "ADMIN",
      },
    ]);
    // @ts-expect-error
    const result = await fillRelationInSchema(schema, prismaMock, "Post", {});
    expect(result.definitions.Post.properties.authorId.enum).toEqual([
      { label: 1, value: 1 },
      { label: 2, value: 2 },
    ]);
  });
});
