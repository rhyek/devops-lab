import React, { useState, useRef, useEffect, FormEvent, useContext } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { Todo } from '../../../../@shared/types/todos';
import TodoItem from './TodoItem';
import TodosContext from './TodosContext';
import backend from '../../utils/backend';

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  padding-bottom: 20px;
  border-bottom: 2px solid silver;
`;

const Form = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > input {
    flex: 1;
    margin-left: 10px;
    font-size: 1em;
  }
`;

export default function TodosList() {
  const { todos, load } = useContext(TodosContext);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const descriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    descriptionRef.current?.focus();
    load();
  }, [load]);

  const addTodo = async (event: FormEvent) => {
    event.preventDefault();
    const newTodo: Todo = {
      id: uuid(),
      description: newTodoDescription,
      completed: false,
    };
    await backend.post('/todos/', newTodo);
    load();
    setNewTodoDescription('');
  };

  const sortedTodos = [...todos.filter(t => !t.completed), ...todos.filter(t => t.completed)];

  return (
    <>
      <List>
        {sortedTodos.map(todo => (
          <li key={todo.id}>
            <TodoItem todo={todo} />
          </li>
        ))}
      </List>
      <Form onSubmit={addTodo}>
        <label>New:</label>
        <input
          ref={descriptionRef}
          type="text"
          value={newTodoDescription}
          onChange={event => setNewTodoDescription(event.target.value)}
        />
      </Form>
    </>
  );
}
