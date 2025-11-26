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

export const validateEventPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const MAX_PAYLOAD_SIZE = 10 * 1024; // 10KB limit

  if (!req.body.name) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  const payloadSize = Buffer.byteLength(JSON.stringify(req.body));
  if (payloadSize > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({ error: 'Payload too large' });
  }

  next();
};

export const requireAccountId = (
  req: Request,
  res: Response,
  next: NextFunction
) => validateNumberParam(req, res, next, 'account_id');
