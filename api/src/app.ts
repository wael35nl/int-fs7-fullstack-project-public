import express, {Application, Request, Response, NextFunction} from 'express';
interface Error {status?: number, message: String};
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import morgan from 'morgan';
import chalk from 'chalk';

import connectDB from './config/db';
import dev from './config/index';
import usersRouter from './routers/users';
import categoryRouter from './routers/category';
import productRouter from './routers/product';

const app: Application = express();
const port = dev.app.serverPort;

app.use(cors({origin: dev.app.clientUrl, credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Test is successful ...' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Not found'));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || 500).json({
      success: false,
      message: err.message
  });
});

app.listen(port, async () => {
  console.log(chalk.green(`Server is running at http://localhost:${port}`));
  await connectDB();
});