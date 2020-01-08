import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Todo } from '../../../../@shared/types/todos';
import TodosContext from './TodosContext';
import backend from '../../utils/backend';

const Main = styled.div<{ isCompleted: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${props =>
    props.isCompleted
      ? css`
          text-decoration: line-through;
          color: grey;
        `
      : null}
  > .description {
    flex: 1;
  }
  > input {
    cursor: pointer;
  }
`;

export default function TodoItem({ todo }: { todo: Todo }) {
  const { load } = useContext(TodosContext);
  const [working, setWorking] = useState(false);

  const { id, description, completed } = todo;

  const toggleCompleted = async () => {
    const path = completed ? 'pending' : 'completed';
    setWorking(true);
    await backend.patch(`/todos/${id}/${path}`);
    await load();
    setWorking(false);
  };

  return (
    <Main isCompleted={completed}>
      <span className="description">{description}</span>
      <input type="checkbox" checked={completed} onChange={toggleCompleted} disabled={working} />
    </Main>
  );
}
