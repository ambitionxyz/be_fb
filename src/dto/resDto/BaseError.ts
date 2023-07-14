import { IBaseError } from "../../types/IBaseError";
import { BaseResDto } from "./BaseResDto";

export const BaseErrorDto = (
  message: string | null = null,
  details: string | null = null
): IBaseError => {
  return {
    ...BaseResDto,
    error: {
      code: 0,
      message: message,
      details: details,
      validationErrors: null,
    },
    success: false,
  };
};
export const baseError = BaseErrorDto;

export const LOGIN_FAILED = BaseErrorDto(
  "Login failed!",
  "Invalid user name or password"
);

export const INVALID_TOKEN = BaseErrorDto(
  "Your request is not valid!",
  "Invalid token"
);

export const UNAUTHORIZED_ERR = BaseErrorDto(
  "Current user did not login to the application"
);
