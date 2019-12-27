import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { getContainerId } from './docker';

export function createHttpApp(port: number, routers: Router[], setup?: (app: Koa) => void) {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    await next();
    if (ctx._matchedRoute && typeof ctx.body === 'undefined') {
      ctx.body = null;
    }
  });

  const defaultRouter = new Router();

  defaultRouter.get('/', async ctx => {
    const data = {
      dockerContainer: await getContainerId(),
    };
    ctx.body = `hi! :-)\n\nstatus:\n${JSON.stringify(data, null, 2)}\n`;
  });

  for (const router of [defaultRouter, ...routers]) {
    app.use(router.routes()).use(router.allowedMethods());
  }

  if (setup) {
    setup(app);
  }

  const finalPort = process.env.NODE_ENV === 'production' ? 8080 : port;

  app.listen(finalPort, () => {
    console.log(`Listening on port ${finalPort}. ${process.env.NODE_ENV}`);
  });
}
