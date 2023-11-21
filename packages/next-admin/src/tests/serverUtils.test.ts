import {
  changeFormatInSchema,
  fillRelationInSchema,
  removeHiddenProperties,
} from "../utils/server";
import { options, prismaMock, schema } from "./singleton";

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
        avatar: null,
      },
      {
        id: 2,
        email: "",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        birthDate: new Date(),
        role: "ADMIN",
        avatar: null
      },
    ]);
    const result = await fillRelationInSchema(schema, prismaMock, "Post", {});
    expect(result.definitions.Post.properties.authorId?.enum).toEqual([
      { label: 1, value: 1 },
      { label: 2, value: 2 },
    ]);
  });
});

describe("transformSchema", () => {
  const userEditOptions = options.model?.User?.edit!;

  it("should return the schema with the new format", async () => {
    const result = changeFormatInSchema(schema, "User", userEditOptions);
    expect(result.definitions.User.properties.birthDate?.format).toEqual(
      "date"
    );
  });

  it("should return the schema without the hidden properties", async () => {
    const result = removeHiddenProperties(schema, "User", userEditOptions);
    expect(result.definitions.User.properties).not.toHaveProperty("createdAt");
    expect(result.definitions.User.properties).not.toHaveProperty("updatedAt");
  });
});
