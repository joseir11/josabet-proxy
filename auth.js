// auth.js - Rotas de autenticação (simulada por enquanto)
const express = require('express');
const router = express.Router();

// Rota de login simulado
router.post('/simular-login', (req, res) => {
  // Gera um token fictício
  const fakeToken = 'token_simulado_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
  res.json({
    autenticado: true,
    token: fakeToken,
    usuario: {
      id: 123,
      nome: 'Usuário Teste',
      email: 'teste@cartola.com'
    }
  });
});

// Rota protegida que retorna dados do time (simulado)
router.get('/time-simulado', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('token_simulado')) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login primeiro.' });
  }
  // Dados fake do time do usuário
  res.json({
    time: {
      nome: 'Meu Time Teste',
      pontuacao: 125.5,
      rodada: 5,
      jogadores: [
        { id: 1, nome: 'Jogador A', posicao: 'ataque', pontos: 12.3 },
        { id: 2, nome: 'Jogador B', posicao: 'meio', pontos: 8.7 }
      ]
    },
    mensagem: 'Dados simulados – substituir pela API real quando tiver credenciais'
  });
});

module.exports = router;
