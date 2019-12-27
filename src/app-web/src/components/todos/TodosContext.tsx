import { createContext } from 'react';
import { Todo } from '../../../../shared/types/todos';

const TodosContext = createContext<{ todos: Todo[]; load: () => Promise<void> }>(undefined as any);

export default TodosContext;
