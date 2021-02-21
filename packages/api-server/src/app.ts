import { createExpressServer } from 'routing-controllers';

import { routingControllersOptions } from './routing-controllers';

const app = createExpressServer(routingControllersOptions);

export { app };
