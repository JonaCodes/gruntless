import { Request, Response, NextFunction } from 'express';

function validateNumberParam(
  req: Request,
  res: Response,
  next: NextFunction,
  paramName: string
) {
  const value = Number(req.query[paramName]);
  if (isNaN(value)) {
    return res.status(400).json({
      error: `Invalid or missing query parameter: ${paramName}. Received ${value}`,
    });
  }

  next();
}

export const requireAccountId = (
  req: Request,
  res: Response,
  next: NextFunction
) => validateNumberParam(req, res, next, 'accountId');
