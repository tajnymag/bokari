import express from 'express';
import { createExpressServer } from 'routing-controllers';

import { routingControllersOptions } from './routing-controllers';

const expressBase = express();
expressBase.set('trust proxy', true);

const app = createExpressServer(routingControllersOptions);

export { app };
