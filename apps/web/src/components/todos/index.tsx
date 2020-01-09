import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import TodosContext from './TodosContext';
import TodosList from './TodosList';
import { Todo } from '../../../../@shared/types/todos';
import backend from '../../utils/backend';

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid silver;
`;

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const load = useCallback(async () => {
    const { data: todos } = await backend.get<Todo[]>('/todos/');
    setTodos(todos);
  }, []);

  return (
    <Main>
      <Title>TODOS</Title>
      <TodosContext.Provider value={{ todos, load }}>
        <TodosList />
      </TodosContext.Provider>
    </Main>
  );
}
