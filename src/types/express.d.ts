import { User } from '@prisma/client'; // Assuming User is a Prisma model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add user to the Request interface
    }
  }
}
