"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(cors_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Rotas de Professores
        fastify.get('/professores', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const professores = yield prisma.professor.findMany({
                include: { disciplinas: true },
            });
            return professores;
        }));
        fastify.post('/professores', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { nome, email } = request.body;
            const novoProfessor = yield prisma.professor.create({
                data: { nome, email },
            });
            return novoProfessor;
        }));
        fastify.put('/professores/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { nome, email } = request.body;
            const professorAtualizado = yield prisma.professor.update({
                where: { id: parseInt(id) },
                data: { nome, email },
            });
            return professorAtualizado;
        }));
        fastify.delete('/professores/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield prisma.professor.delete({
                where: { id: parseInt(id) },
            });
            return { message: 'Professor deletado com sucesso' };
        }));
        // Rotas de Alunos
        fastify.get('/alunos', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const alunos = yield prisma.aluno.findMany({
                include: { disciplinas: true },
            });
            return alunos;
        }));
        fastify.post('/alunos', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { nome, email } = request.body;
            const novoAluno = yield prisma.aluno.create({
                data: { nome, email },
            });
            return novoAluno;
        }));
        fastify.put('/alunos/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { nome, email } = request.body;
            const alunoAtualizado = yield prisma.aluno.update({
                where: { id: parseInt(id) },
                data: { nome, email },
            });
            return alunoAtualizado;
        }));
        fastify.delete('/alunos/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield prisma.aluno.delete({
                where: { id: parseInt(id) },
            });
            return { message: 'Aluno deletado com sucesso' };
        }));
        // Rotas de Disciplinas
        fastify.get('/disciplinas', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const disciplinas = yield prisma.disciplina.findMany({
                include: { professor: true, alunos: true },
            });
            return disciplinas;
        }));
        fastify.post('/disciplinas', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { nome, professorId, alunos } = request.body;
            const alunosComProblema = [];
            for (const alunoId of alunos) {
                const aluno = yield prisma.aluno.findUnique({
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
            const novaDisciplina = yield prisma.disciplina.create({
                data: {
                    nome,
                    professorId,
                    alunos: {
                        connect: alunos.map(id => ({ id })),
                    }
                },
            });
            return novaDisciplina;
        }));
        fastify.put('/disciplinas/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { nome, professorId, alunos } = request.body;
            const alunosComProblema = [];
            for (const alunoId of alunos) {
                const aluno = yield prisma.aluno.findUnique({
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
            const disciplinaAtualizada = yield prisma.disciplina.update({
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
        }));
        fastify.delete('/disciplinas/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield prisma.disciplina.delete({
                where: { id: parseInt(id) },
            });
            return { message: 'Disciplina deletada com sucesso' };
        }));
        try {
            yield fastify.listen({ port: 3000 });
            fastify.log.info(`Servidor rodando na porta 3000`);
        }
        catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
