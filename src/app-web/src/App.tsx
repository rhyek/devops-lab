import React from 'react';
import styled from 'styled-components';
import Todos from './components/todos';

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 50px;
`;

const App: React.FC = () => {
  return (
    <Main>
      <Todos />
    </Main>
  );
};

export default App;
