import React from 'react';
import Clientes from './components/Clientes';
import Productos from './components/Productos';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ferretería</h1>
      </header>
      <main>
        <Clientes />
        <Productos />
      </main>
    </div>
  );
}

export default App;