import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Professores from './components/Professores';
import Alunos from './components/Alunos';
import Disciplinas from './components/Disciplinas';
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link className="link" to="/disciplinas">Disciplinas</Link></li>
          <li><Link className="link" to="/professores">Professores</Link></li>
          <li><Link className="link" to="/alunos">Alunos</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/professores" element={<Professores />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/disciplinas" element={<Disciplinas />} />
      </Routes>
    </Router>
  );
};

export default App;
