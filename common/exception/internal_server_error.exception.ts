import { BaseException } from "./base.exception";

export class InternalServerErrorException extends BaseException {
  constructor(message: string) {
    super(message, 500);
  }
}
