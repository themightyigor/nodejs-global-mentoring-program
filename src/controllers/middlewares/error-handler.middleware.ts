import { Request, Response, NextFunction } from 'express';
import { BaseError } from 'sequelize';

import { AlreadyDeletedError } from '../../errors/already-deleted.error';
import { ForbiddenError } from '../../errors/forbidden.error';
import { NotFoundError } from '../../errors/not-found.error';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { errorLogger } from '../../loggers/error.logger';
import { getRequestArguments } from '../../utilities/get-request-arguments';

export const errorsHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const requestArguments: string = getRequestArguments(req.body, req.query);

  switch (error.constructor) {
    case NotFoundError:
      errorLogger.error(error.message, { requestMethod: req.method, requestArguments });
  
       res.status(404)
                .json({
                  type: 'NotFoundError',
                  message: error.message,
                });

      break;
    case UnauthorizedError:
      errorLogger.error(error.message, { requestMethod: req.method, requestArguments });
  
      res.status(401)
               .json({
                 type: 'UnauthorizedError',
                 message: error.message,
               });

      break;
    case ForbiddenError:
      errorLogger.error(error.message, { requestMethod: req.method, requestArguments });
  
      res.status(403)
              .json({
                type: 'ForbiddenError',
                message: error.message,
              });

      break;
    case AlreadyDeletedError:
      errorLogger.error(error.message, { requestMethod: req.method, requestArguments });
  
      res.status(500)
               .json({
                 type: 'AlreadyDeletedError',
                 message: error.message,
               });

      break;
    case BaseError:
      errorLogger.error(error.message, { requestMethod: req.method, requestArguments });
  
      res.status(503)
              .json({
                type: 'BaseError',
                message: error.message,
              });

      break;
    default:
      next(error);
  }
};
