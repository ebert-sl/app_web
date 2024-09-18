import React, { useState, useEffect } from 'react';
import { getAlunos, createAluno, updateAluno, deleteAluno } from '../services/api';
import './styles.css';

interface Aluno {
  id: number;
  nome: string;
  email: string;
}

const Alunos: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadAlunos();
  }, []);

  const loadAlunos = async () => {
    const response = await getAlunos();
    setAlunos(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) {
      await createAluno({ nome, email });
    } else {
      await updateAluno(editingId, { nome, email });
      setEditingId(null);
    }
    setNome('');
    setEmail('');
    loadAlunos();
  };

  const handleEdit = (aluno: Aluno) => {
    setNome(aluno.nome);
    setEmail(aluno.email);
    setEditingId(aluno.id);
  };

  const handleDelete = async (id: number) => {
    await deleteAluno(id);
    loadAlunos();
  };

  return (
    <div className="container">
      <h2>Alunos</h2>
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
        {alunos.map((aluno) => (
          <li key={aluno.id} className="listItem">
            {aluno.nome} ({aluno.email})
            <button onClick={() => handleEdit(aluno)} className="first-button button">Editar</button>
            <button onClick={() => handleDelete(aluno.id)} className="button">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alunos;