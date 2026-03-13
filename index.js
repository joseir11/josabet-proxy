const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Rota para status do mercado
app.get('/mercado/status', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/mercado/status');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar status do mercado' });
  }
});

// Rota para o mercado de atletas (já usada no frontend)
app.get('/mercado', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/atletas/mercado');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar mercado' });
  }
});

// Rota para atletas pontuados (você pode passar a rodada como parâmetro)
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

// Rota para destaques pós-rodada
app.get('/pos-rodada/destaques', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/pos-rodada/destaques');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar destaques' });
  }
});

// Rota para clubes
app.get('/clubes', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/clubes');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clubes' });
  }
});

// Rota para posições
app.get('/posicoes', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/posicoes');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar posições' });
  }
});

// Rota para partidas (todas ou de uma rodada específica)
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

// Rota para vídeos
app.get('/videos', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/videos');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar vídeos' });
  }
});

// Rota para rodadas
app.get('/rodadas', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/rodadas');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar rodadas' });
  }
});

// Rota para rankings (pode conter dados de ligas)
app.get('/rankings', async (req, res) => {
  try {
    const response = await axios.get('https://api.cartola.globo.com/rankings');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar rankings' });
  }
});

// Rota para uma liga específica (exemplo com código)
app.get('/liga/:codigo', async (req, res) => {
  const { codigo } = req.params;
  try {
    // A API pública de ligas pode não existir; fazemos uma tentativa com o endpoint /ligas/{codigo}
    const response = await axios.get(`https://api.cartola.globo.com/ligas/${codigo}`);
    res.json(response.data);
  } catch (error) {
    // Se não funcionar, retornamos um erro amigável
    res.status(404).json({ erro: 'Liga não encontrada ou API indisponível' });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
