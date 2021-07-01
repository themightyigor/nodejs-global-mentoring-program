import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../loggers/request.logger';
import { getRequestArguments } from '../../utilities/get-request-arguments';

export const requestInfoMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestArguments: string | boolean = getRequestArguments(req.body, req.query);

  requestLogger.info(`'${req.method}' method has been invoked with: ${requestArguments ? requestArguments : 'no arguments'} :)`);
  next();
};
