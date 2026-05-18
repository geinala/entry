import { BaseException } from "./base.exception";

export class UnauthorizedException extends BaseException {
  constructor(message: string) {
    super(message, 401);
  }
}
