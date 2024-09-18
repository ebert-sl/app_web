import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL da API Fastify
});

// Funções relacionadas a Professores
export const getProfessores = () => api.get('/professores');
export const createProfessor = (data: { nome: string; email: string }) => api.post('/professores', data);
export const updateProfessor = (id: number, data: { nome: string; email: string }) => api.put(`/professores/${id}`, data);
export const deleteProfessor = (id: number) => api.delete(`/professores/${id}`);

// Funções relacionadas a Alunos
export const getAlunos = () => api.get('/alunos');
export const createAluno = (data: { nome: string; email: string }) => api.post('/alunos', data);
export const updateAluno = (id: number, data: { nome: string; email: string }) => api.put(`/alunos/${id}`, data);
export const deleteAluno = (id: number) => api.delete(`/alunos/${id}`);

// Funções relacionadas a Disciplinas
export const getDisciplinas = () => api.get('/disciplinas');
export const createDisciplina = (data: { nome: string; professorId: number; alunos: number[] }) => api.post('/disciplinas', data);
export const updateDisciplina = (id: number, data: { nome: string; professorId: number; alunos: number[] }) => api.put(`/disciplinas/${id}`, data);
export const deleteDisciplina = (id: number) => api.delete(`/disciplinas/${id}`);
