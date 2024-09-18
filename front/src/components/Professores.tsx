import React, { useState, useEffect } from 'react';
import { getProfessores, createProfessor, updateProfessor, deleteProfessor } from '../services/api';
import './styles.css';

interface Professor {
  id: number;
  nome: string;
  email: string;
}

const Professores: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    const response = await getProfessores();
    setProfessores(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) {
      await createProfessor({ nome, email });
    } else {
      await updateProfessor(editingId, { nome, email });
      setEditingId(null);
    }
    setNome('');
    setEmail('');
    loadProfessores();
  };

  const handleEdit = (professor: Professor) => {
    setNome(professor.nome);
    setEmail(professor.email);
    setEditingId(professor.id);
  };

  const handleDelete = async (id: number) => {
    await deleteProfessor(id);
    loadProfessores();
  };

  return (
    <div className="container">
      <h2>Professores</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">{editingId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <ul className="list">
        {professores.map((professor) => (
          <li key={professor.id} className="listItem">
            {professor.nome} ({professor.email})
            <button onClick={() => handleEdit(professor)} className="first-button button">Editar</button>
            <button onClick={() => handleDelete(professor.id)} className="button">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Professores;