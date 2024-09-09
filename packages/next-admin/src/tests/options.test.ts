import { getCustomInputs } from "../utils/options";
import { options } from "./singleton";

describe("Options", () => {
  it("should retrieve 1 custom input for User model", () => {
    const customInputs = getCustomInputs("User", options);

    expect(Object.keys(customInputs).length).toBe(1);
    expect(customInputs?.email).toBeDefined();
  });
});
