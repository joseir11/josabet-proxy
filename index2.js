const express = require('express');
const axios = require('axios');
const cors = require('cors');
const compression = require('compression');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CONFIG GLOBAL ====================
app.use(cors());
app.use(compression());

// axios com keep-alive (mais rápido)
const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  timeout: 5000
});

// ==================== CACHE ====================
let cachePontuadosAtual = null;
let lastUpdatePontuados = 0;
const TTL = 10000; // 10 segundos

// ==================== FUNÇÃO DE ATUALIZAÇÃO ====================
async function atualizarPontuados() {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/atletas/pontuados'
    );

    cachePontuadosAtual = response.data;
    lastUpdatePontuados = Date.now();

    console.log('🔥 Cache pontuados atualizado');
  } catch (err) {
    console.log('Erro ao atualizar pontuados:', err.message);
  }
}

// roda automaticamente
setInterval(atualizarPontuados, TTL);

// primeira execução imediata
atualizarPontuados();

// ==================== ROTAS ====================

// -------- PROVÁVEIS --------
app.get('/provaveis/lineups', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://provaveisdocartola.com.br/assets/data/lineups.json',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar lineups' });
  }
});

app.get('/provaveis/mercado-images', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://provaveisdocartola.com.br/assets/data/mercado.images.json',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar mercado.images' });
  }
});

app.get('/provaveis/team-updates', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://provaveisdocartola.com.br/assets/data/team-updates.json',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar team-updates' });
  }
});

// -------- MERCADO --------
app.get('/mercado/status', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/mercado/status'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar status do mercado' });
  }
});

app.get('/mercado', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/atletas/mercado'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar mercado' });
  }
});

// -------- PONTUADOS (OTIMIZADO) --------
app.get('/atletas/pontuados/:rodada?', async (req, res) => {
  const rodada = req.params.rodada;

  try {
    // 👉 RODADA ATUAL → USA CACHE
    if (!rodada) {
      if (!cachePontuadosAtual) {
        return res.status(503).json({ erro: 'Cache ainda carregando' });
      }

      return res.json(cachePontuadosAtual);
    }

    // 👉 RODADAS ANTIGAS → BUSCA DIRETO (leve)
    const response = await axiosInstance.get(
      `https://api.cartola.globo.com/atletas/pontuados/${rodada}`
    );

    return res.json(response.data);

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar pontuados' });
  }
});

// -------- RESTANTE --------
app.get('/pos-rodada/destaques', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/pos-rodada/destaques'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar destaques' });
  }
});

app.get('/clubes', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/clubes'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar clubes' });
  }
});

app.get('/posicoes', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/posicoes'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar posições' });
  }
});

app.get('/partidas/:rodada?', async (req, res) => {
  const rodada = req.params.rodada || '';
  const url = rodada
    ? `https://api.cartola.globo.com/partidas/${rodada}`
    : `https://api.cartola.globo.com/partidas`;

  try {
    const response = await axiosInstance.get(url);
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar partidas' });
  }
});

app.get('/rodadas', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/rodadas'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar rodadas' });
  }
});

app.get('/rankings', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://api.cartola.globo.com/rankings'
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar rankings' });
  }
});

// -------- COMPETIÇÃO --------
app.get('/competicao/:tipo/:codigo', async (req, res) => {
  const { tipo, codigo } = req.params;

  let url;
  if (tipo === 'liga') {
    url = `https://cartola.globo.com/#!/liga/${codigo}`;
  } else if (tipo === 'pontoscorridos') {
    url = `https://cartola.globo.com/#!/competicoes/pontoscorridos/${codigo}`;
  } else {
    return res.status(400).json({ erro: 'Tipo inválido' });
  }

  res.json({
    mensagem: 'Sem API oficial para competição',
    link: url,
    tipo,
    codigo
  });
});

// -------- TIME --------
app.get('/time/:id', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      `https://api.cartola.globo.com/time/id/${req.params.id}`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar time' });
  }
});

// -------- AWS --------
app.get('/aws/atletas-pontuados', async (req, res) => {
  try {
    const response = await axiosInstance.get(
      'https://pb89hpsof3.execute-api.us-east-1.amazonaws.com/prod/atletas-pontuados',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      erro: 'Erro AWS',
      detalhe: error.message
    });
  }
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log(`🚀 Proxy rodando na porta ${PORT}`);
});