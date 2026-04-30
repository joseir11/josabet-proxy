const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ==================== ROTAS DE AUTENTICAÇÃO (NOVO MÓDULO) ====================
const authRoutes = require('./auth');
app.use('/auth', authRoutes);

// ==================== ROTAS EXISTENTES (ORIGINAIS) ====================

// Lineups
app.get('/provaveis/lineups', async (req, res) => {
  try {
    const response = await axios.get('https://provaveisdocartola.com.br/assets/data/lineups.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar lineups' });
  }
});

// Mercado imagens
app.get('/provaveis/mercado-images', async (req, res) => {
  try {
    const response = await axios.get('https://provaveisdocartola.com.br/assets/data/mercado.images.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar mercado.images' });
  }
});

// Team updates
app.get('/provaveis/team-updates', async (req, res) => {
  try {
    const response = await axios.get('https://provaveisdocartola.com.br/assets/data/team-updates.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar team-updates' });
  }
});

// Status do mercado
app.get('/mercado/status', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/mercado/status');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar status do mercado' });
  }
});

// Mercado de atletas
app.get('/mercado', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/atletas/mercado');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar mercado' });
  }
});

// Atletas pontuados (opcional rodada)
app.get('/atletas/pontuados/:rodada?', async (req, res) => {
  const rodada = req.params.rodada || '';
  const url = rodada 
    ? `https://api.cartola.globo.com/atletas/pontuados/${rodada}`
    : 'https://api.cartola.globo.com/atletas/pontuados';
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar pontuados' });
  }
});

// Destaques pós-rodada
app.get('/pos-rodada/destaques', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/pos-rodada/destaques');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar destaques' });
  }
});

// Clubes
app.get('/clubes', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/clubes');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clubes' });
  }
});

// Posições
app.get('/posicoes', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/posicoes');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar posições' });
  }
});

// Partidas (com ou sem rodada)
app.get('/partidas/:rodada?', async (req, res) => {
  const rodada = req.params.rodada || '';
  const url = rodada 
    ? `https://api.cartola.globo.com/partidas/${rodada}`
    : 'https://api.cartola.globo.com/partidas';
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar partidas' });
  }
});

// Vídeos
app.get('/videos', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/videos');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar vídeos' });
  }
});

// Rodadas
app.get('/rodadas', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/rodadas');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar rodadas' });
  }
});

// Rankings
app.get('/rankings', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/rankings');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar rankings' });
  }
});

// Competições (liga / pontos corridos)
app.get('/competicao/:tipo/:codigo', async (req, res) => {
  const { tipo, codigo } = req.params;
  let url;
  if (tipo === 'liga') {
    url = `https://cartola.globo.com/#!/liga/${codigo}`;
  } else if (tipo === 'pontoscorridos') {
    url = `https://cartola.globo.com/#!/competicoes/pontoscorridos/${codigo}`;
  } else {
    return res.status(400).json({ erro: 'Tipo inválido. Use "liga" ou "pontoscorridos".' });
  }
  res.json({
    mensagem: 'Dados detalhados não disponíveis via API pública.',
    link: url,
    tipo: tipo,
    codigo: codigo
  });
});

// ==================== INÍCIO DO SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
