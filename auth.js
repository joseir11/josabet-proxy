// auth.js
const express = require('express');
const router = express.Router();

router.post('/simular-login', (req, res) => {
  const fakeToken = 'token_simulado_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
  res.json({
    autenticado: true,
    token: fakeToken,
    usuario: { id: 123, nome: 'Usuário Teste', email: 'teste@cartola.com' }
  });
});

router.get('/time-simulado', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('token_simulado')) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  res.json({
    time: {
      nome: 'Meu Time Teste',
      pontuacao: 125.5,
      rodada: 5,
      jogadores: [
        { id: 1, nome: 'Jogador A', posicao: 'ataque', pontos: 12.3 },
        { id: 2, nome: 'Jogador B', posicao: 'meio', pontos: 8.7 }
      ]
    }
  });
});

module.exports = router;
