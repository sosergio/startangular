export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ApplicationError extends Error{
  unrecoverable: boolean;
  constructor(message?: string) {
    super(message);
    this.name = "ApplicationError";
  }
}
