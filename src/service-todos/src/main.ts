import Router from 'koa-router';
import { NotFound } from 'http-errors';
import { createHttpApp } from '../../shared/utils/services/http';
import { Todo } from '../../shared/types/todos';

const router = new Router<{}>({ prefix: '/todos' });

const todos: Todo[] = [];

router.get('/', async ctx => {
  ctx.body = todos;
});

router.post('/', async ctx => {
  const todo: Todo = ctx.request.body;
  todos.push(todo);
});

router.patch('/:id/completed', async ctx => {
  const todo = todos.find(todo => todo.id === ctx.params.id);
  if (!todo) {
    throw new NotFound();
  }
  todo.completed = true;
});

router.patch('/:id/pending', async ctx => {
  const todo = todos.find(todo => todo.id === ctx.params.id);
  if (!todo) {
    throw new NotFound();
  }
  todo.completed = false;
});

createHttpApp(3001, [router]);
