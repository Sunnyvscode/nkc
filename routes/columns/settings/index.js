const Router = require('koa-router');
const router = new Router();
const postRouter = require('./post');
const contributeRouter = require('./contribute');
const categoryRouter = require('./category');
const closeRouter = require('./close');
const transferRouter = require('./transfer');
const pageRouter = require('./page');
const fansRouter = require('./fans');
router
  .use('/', async (ctx, next) => {
    const { user, column } = ctx.data;
    if (column.uid !== user.uid && !ctx.permission('column_single_disabled')) {
      ctx.throw(403, '权限不足');
    }
    await next();
  })
  .get('/', async (ctx, next) => {
    ctx.template = 'columns/settings/info.pug';
    ctx.data.nav = 'settings';
    await next();
  })
  .use(
    '/contribute',
    contributeRouter.routes(),
    contributeRouter.allowedMethods(),
  )
  .use('/category', categoryRouter.routes(), categoryRouter.allowedMethods())
  .use('/transfer', transferRouter.routes(), transferRouter.allowedMethods())
  .use('/close', closeRouter.routes(), closeRouter.allowedMethods())
  .use('/page', pageRouter.routes(), pageRouter.allowedMethods())
  .use('/fans', fansRouter.routes(), fansRouter.allowedMethods())
  .use('/post', postRouter.routes(), postRouter.allowedMethods());
module.exports = router;
