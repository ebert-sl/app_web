import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const fastify = Fastify({ logger: true })

fastify.register(fastifyCors)

async function main() {
  // Rotas de Professores

  fastify.get('/professores', async (request, reply) => {
    const professores = await prisma.professor.findMany({
      include: { disciplinas: true },
    });
    return professores;
  });

  fastify.post('/professores', async (request, reply) => {
    const { nome, email } = request.body as { nome: string; email: string };
    const novoProfessor = await prisma.professor.create({
      data: { nome, email },
    });
    return novoProfessor;
  });

  fastify.put('/professores/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, email } = request.body as { nome: string; email: string };
    const professorAtualizado = await prisma.professor.update({
      where: { id: parseInt(id) },
      data: { nome, email },
    });
    return professorAtualizado;
  });
  
  fastify.delete('/professores/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.professor.delete({
      where: { id: parseInt(id) },
    });
    return { message: 'Professor deletado com sucesso' };
  });

  // Rotas de Alunos

  fastify.get('/alunos', async (request, reply) => {
    const alunos = await prisma.aluno.findMany({
      include: { disciplinas: true },
    });
    return alunos;
  });

  fastify.post('/alunos', async (request, reply) => {
    const { nome, email } = request.body as { nome: string; email: string };
    const novoAluno = await prisma.aluno.create({
      data: { nome, email },
    });
    return novoAluno;
  });

  fastify.put('/alunos/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, email } = request.body as { nome: string; email: string };
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: parseInt(id) },
      data: { nome, email },
    });
    return alunoAtualizado;
  });
  
  fastify.delete('/alunos/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.aluno.delete({
      where: { id: parseInt(id) },
    });
    return { message: 'Aluno deletado com sucesso' };
  });

  // Rotas de Disciplinas

  fastify.get('/disciplinas', async (request, reply) => {
    const disciplinas = await prisma.disciplina.findMany({
      include: { professor: true, alunos: true },
    });
    return disciplinas;
  });

  fastify.post('/disciplinas', async (request, reply) => {
    const { nome, professorId, alunos } = request.body as { nome: string; professorId: number; alunos: number[] };
    
    const alunosComProblema = [];
  
    for (const alunoId of alunos) {
      const aluno = await prisma.aluno.findUnique({
        where: { id: alunoId },
        include: { disciplinas: true },
      });
  
      if (aluno && aluno.disciplinas.length >= 4) {
        alunosComProblema.push({ nome: aluno.nome, totalDisciplinas: aluno.disciplinas.length });
      }
    }
  
    if (alunosComProblema.length > 0) {
      const nomesAlunos = alunosComProblema.map(aluno => aluno.nome).join(', ');
      return reply.status(400).send({ message: `Há aluno(s) com 4 ou mais disciplinas: ${nomesAlunos}`, alunos: alunosComProblema });
    }
  
    const novaDisciplina = await prisma.disciplina.create({
      data: { 
        nome, 
        professorId,
        alunos: {
          connect: alunos.map(id => ({ id })),
        }
      },
    });
    return novaDisciplina;
  });  
  
  fastify.put('/disciplinas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, professorId, alunos } = request.body as { nome: string; professorId: number; alunos: number[] };
  
    const alunosComProblema = [];
  
    for (const alunoId of alunos) {
      const aluno = await prisma.aluno.findUnique({
        where: { id: alunoId },
        include: { disciplinas: true },
      });
  
      if (aluno && aluno.disciplinas.length >= 4) {
        alunosComProblema.push({ nome: aluno.nome, totalDisciplinas: aluno.disciplinas.length });
      }
    }
  
    if (alunosComProblema.length > 0) {
      const nomesAlunos = alunosComProblema.map(aluno => aluno.nome).join(', ');
      return reply.status(400).send({ message: `Há aluno(s) com 4 ou mais disciplinas: ${nomesAlunos}`, alunos: alunosComProblema });
    }
  
    const disciplinaAtualizada = await prisma.disciplina.update({
      where: { id: parseInt(id) },
      data: { 
        nome, 
        professorId,
        alunos: {
          set: alunos.map(id => ({ id }))
        }
      },
    });
    return disciplinaAtualizada;
  });
  
  fastify.delete('/disciplinas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.disciplina.delete({
      where: { id: parseInt(id) },
    });
    return { message: 'Disciplina deletada com sucesso' };
  });

  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Servidor rodando na porta 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})