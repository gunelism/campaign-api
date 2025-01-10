import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints || {}).join(", "),
      );
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errorMessages });
    }
    next();
  };
}
