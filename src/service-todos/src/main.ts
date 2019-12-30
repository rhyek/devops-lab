import { NotFound } from 'http-errors';
import { createHttpApp } from '../../shared/utils/services/http';
import { Todo } from '../../shared/types/todos';

const todos: Todo[] = [];

createHttpApp('todos', 3001, defaultRouter => {
  defaultRouter.get('/', async ctx => {
    ctx.body = todos;
  });

  defaultRouter.post('/', async ctx => {
    const todo: Todo = ctx.request.body;
    todos.push(todo);
  });

  defaultRouter.patch('/:id/completed', async ctx => {
    const todo = todos.find(todo => todo.id === ctx.params.id);
    if (!todo) {
      throw new NotFound();
    }
    todo.completed = true;
  });

  defaultRouter.patch('/:id/pending', async ctx => {
    const todo = todos.find(todo => todo.id === ctx.params.id);
    if (!todo) {
      throw new NotFound();
    }
    todo.completed = false;
  });
});
