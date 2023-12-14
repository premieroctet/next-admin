import { prismaMock } from "./singleton";
import { exportModelAsCsv } from '../csv'

describe("CSV", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      now: new Date('2023-01-01T00:00:00.000Z'),
    });
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should export a CSV for a given model', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 1,
        email: "user1@nextadmin.io",
        name: "User 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        birthDate: null,
        role: "USER",
        avatar: null,
        metadata: null
      },
      {
        id: 2,
        email: "user2@nextadmin.io",
        name: "User 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        birthDate: new Date(),
        role: "ADMIN",
        avatar: "https://gravatar.com/avatar/1",
        metadata: { foo: "bar" }
      },
    ]);

    const expected = `id,email,name,createdAt,updatedAt,birthDate,role,avatar,metadata
1,user1@nextadmin.io,User 1,2023-01-01T00:00:00.000Z,2023-01-01T00:00:00.000Z,,USER,,
2,user2@nextadmin.io,User 2,2023-01-01T00:00:00.000Z,2023-01-01T00:00:00.000Z,2023-01-01T00:00:00.000Z,ADMIN,https://gravatar.com/avatar/1,"{""foo"":""bar""}"
`

    expect(await exportModelAsCsv(prismaMock, "User")).toBe(expected)
  })
})