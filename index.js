const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa o CORS para permitir requisições de outros domínios

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para todas as origens (resolve o erro de política)
app.use(cors());

// ==================== ROTAS EXISTENTES ====================

// Lineups (escalações)
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

// Mercado de imagens (dados dos jogadores)
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

// Atletas pontuados (com ou sem rodada)
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

// Partidas (todas ou de uma rodada específica)
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

// ==================== ROTA PARA COMPETIÇÕES (NOVA) ====================
// Exemplo de uso:
//   /competicao/liga/taca-nattos
//   /competicao/pontoscorridos/d5rp3vak58ms73eri3d0
app.get('/competicao/:tipo/:codigo', async (req, res) => {
  const { tipo, codigo } = req.params;

  // Monta a URL da página pública da competição no site do Cartola
  let url;
  if (tipo === 'liga') {
    url = `https://cartola.globo.com/#!/liga/${codigo}`;
  } else if (tipo === 'pontoscorridos') {
    url = `https://cartola.globo.com/#!/competicoes/pontoscorridos/${codigo}`;
  } else {
    return res.status(400).json({ erro: 'Tipo de competição inválido. Use "liga" ou "pontoscorridos".' });
  }

  // Como a API pública do Cartola não fornece dados estruturados de ligas,
  // retornamos um objeto com a URL para que o frontend possa exibir um link.
  // Futuramente, podemos implementar scraping para extrair os dados.
  res.json({
    mensagem: 'Os dados detalhados desta competição não estão disponíveis via API pública.',
    link: url,
    tipo: tipo,
    codigo: codigo
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
