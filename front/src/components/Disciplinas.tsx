import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { AxiosError } from 'axios'; // If you're using Axios
import { getDisciplinas, createDisciplina, updateDisciplina, deleteDisciplina, getProfessores, getAlunos } from '../services/api';
import './styles.css';

interface Disciplina {
  id: number;
  nome: string;
  professor: { id: number, nome: string };
  alunos: { id: number, nome: string }[];
}

interface Option {
  value: number;
  label: string;
}

const Disciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState('');
  const [professorOptions, setProfessorOptions] = useState<Option[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Option | null>(null);
  const [alunoOptions, setAlunoOptions] = useState<Option[]>([]);
  const [selectedAlunos, setSelectedAlunos] = useState<Option[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadDisciplinas();
    loadProfessores();
    loadAlunos();
  }, []);

  const loadDisciplinas = async () => {
    const response = await getDisciplinas();
    setDisciplinas(response.data);
  };

  const loadProfessores = async () => {
    const response = await getProfessores();
    const options = response.data.map((professor: { id: number, nome: string }) => ({
      value: professor.id,
      label: professor.nome,
    }));
    setProfessorOptions(options);
  };

  const loadAlunos = async () => {
    const response = await getAlunos();
    const options = response.data.map((aluno: { id: number, nome: string }) => ({
      value: aluno.id,
      label: aluno.nome,
    }));
    setAlunoOptions(options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId === null) {
        if (selectedProfessor) {
          await createDisciplina({
            nome,
            professorId: selectedProfessor.value,
            alunos: selectedAlunos.map((aluno) => aluno.value),
          });
        }
      } else {
        if (selectedProfessor) {
          await updateDisciplina(editingId, {
            nome,
            professorId: selectedProfessor.value,
            alunos: selectedAlunos.map((aluno) => aluno.value),
          });
          setEditingId(null);
        }
      }
      setNome('');
      setSelectedProfessor(null);
      setSelectedAlunos([]);
      loadDisciplinas();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        alert(error.response.data.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleEdit = (disciplina: Disciplina) => {
    setNome(disciplina.nome);
    setSelectedProfessor({
      value: disciplina.professor.id,
      label: disciplina.professor.nome,
    });
    setSelectedAlunos(disciplina.alunos.map((aluno) => ({
      value: aluno.id,
      label: aluno.nome,
    })));
    setEditingId(disciplina.id);
  };

  const handleDelete = async (id: number) => {
    await deleteDisciplina(id);
    loadDisciplinas();
  };

  return (
    <div className="container">
      <h2>Disciplinas</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input"
          required
        />

        <Select
          className="select" 
          placeholder="Selecione o Professor"
          value={selectedProfessor}
          onChange={(option) => setSelectedProfessor(option)}
          options={professorOptions}
          required
        />

        <Select
          className="select" 
          placeholder="Selecione os Alunos"
          value={selectedAlunos}
          onChange={(options) => setSelectedAlunos(Array.from(options || []))}
          options={alunoOptions}
          isMulti
        />

        <button type="submit" className="button">{editingId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <ul className="list">
        {disciplinas.map((disciplina) => (
          <li key={disciplina.id} className="listItem">
            <strong>{disciplina.nome}</strong> - Professor: {disciplina.professor.nome}
            <ul className="subList">
              <li><strong>Alunos:</strong></li>
              {disciplina.alunos.length > 0 ? (
                disciplina.alunos.map((aluno) => (
                  <li key={aluno.id}>{aluno.nome}</li>
                ))
              ) : (
                <li>Nenhum aluno cadastrado</li>
              )}
            </ul>
            <button className="button" onClick={() => handleEdit(disciplina)}>Editar</button>
            <button className="button" onClick={() => handleDelete(disciplina.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Disciplinas;
