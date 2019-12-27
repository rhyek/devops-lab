import React, { useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TodosContext from './TodosContext';
import TodosList from './TodosList';
import { Todo } from '../../../../shared/types/todos';

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
    const { data: todos } = await axios.get<Todo[]>('http://localhost:3001/todos');
    setTodos(todos);
  }, []);

  return (
    <Main>
      <Title>Todos</Title>
      <TodosContext.Provider value={{ todos, load }}>
        <TodosList />
      </TodosContext.Provider>
    </Main>
  );
}
