import express from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from './generated/routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

RegisterRoutes(app);

app.use(errorHandler);

export { app };
