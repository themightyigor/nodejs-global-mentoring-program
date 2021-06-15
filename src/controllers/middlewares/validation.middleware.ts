import { Schema, ValidationErrorItem } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
  const errors = schemaErrors.map(error => {
    const { path, message } = error;
    return { path, message };
  });
  return {
    status: 'failed',
    errors
  };
};

export const validateSchemaMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (!error) {
      next();
      return;
    }
    res.status(400).json(errorResponse(error.details));
  };
};
