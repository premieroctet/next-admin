import { getMappedDataList } from "../utils/prisma";
import { options, prismaMock } from "./singleton";

describe("getMappedDataList", () => {
  it("should return the data list, total and error", async () => {


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
        published: true,
        authorId: 1,
      }
    ]

    prismaMock.post.findMany.mockResolvedValueOnce(postData)

    prismaMock.post.count.mockResolvedValueOnce(2);

    const result = await getMappedDataList(prismaMock, "Post", options, new URLSearchParams());
    expect(result).toEqual({
      data: postData,
      total: postData.length,
      error: null,
    });
  });
});
