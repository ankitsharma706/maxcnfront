import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  function xssClean(): RequestHandler;
  export default xssClean;
}

export {};
