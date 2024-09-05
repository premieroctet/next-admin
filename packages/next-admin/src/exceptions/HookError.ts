export class HookError<T extends { error: string }> extends Error {
  public data: T;

  constructor(
    public status: number,
    data: T
  ) {
    super();

    if (!data.error) {
      throw new Error(
        "HookError requires an error property in the data object"
      );
    }
    this.data = data;
  }
}
