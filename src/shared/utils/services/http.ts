import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { getContainerId } from './docker';

export function createHttpApp(servicePath: string, port: number, setup: (defaultRouter: Router) => void) {
  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    await next();
    if (ctx._matchedRoute && typeof ctx.body === 'undefined') {
      ctx.body = null;
    }
  });

  const statusHandler: Koa.Middleware = async ctx => {
    const data = {
      servicePath,
      requestPath: ctx.request.path,
      dockerContainer: await getContainerId(),
    };
    ctx.body = `hi. :-)\n\nstatus:\n${JSON.stringify(data, null, 2)}\n`;
  };

  app.use(async (ctx, next) => {
    if (ctx.path === '/') {
      await statusHandler(ctx, next);
    } else {
      await next();
    }
  });

  const defaultRouter = new Router({ prefix: `/${servicePath}` });
  defaultRouter.get('/status', statusHandler);
  setup(defaultRouter);
  app.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());

  const finalPort = process.env.NODE_ENV === 'production' ? 8080 : port;

  app.listen(finalPort, () => {
    console.log(`Listening on port ${finalPort}.`);
  });
}
