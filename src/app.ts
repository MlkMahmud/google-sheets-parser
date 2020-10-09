import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { ApiError } from './types';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/sheet', router);
// eslint-disable-next-line no-unused-vars
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message,
  });
});

export default app;
