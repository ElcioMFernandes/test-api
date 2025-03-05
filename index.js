const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("./authMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Prisma Client
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API rodando no Render!" });
});

// Rota para testar a conexão com o banco
app.get("/db-test", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`; // Consulta simples
    res.json({ message: "Banco conectado!", time: result[0].now });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco", details: error });
  }
});

// Rota protegida de exemplo
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Você acessou uma rota protegida!", user: req.user });
});

// Rotas protegidas para CRUD de usuários
app.post("/users", authMiddleware, async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário", details: error });
  }
});

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários", details: error });
  }
});

app.put("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar usuário", details: error });
  }
});

app.delete("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário", details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
