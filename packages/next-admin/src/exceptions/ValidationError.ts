export type PropertyValidationError = {
  property: string;
  message: string;
};

export class ValidationError extends Error {
  public errors;

  constructor(message: string, errors: PropertyValidationError[]) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
