const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const CARTOLA_API = 'https://api.cartolafc.globo.com';

// Mercado de jogadores
app.get('/mercado', async (req, res) => {
  try {
    const response = await axios.get(`${CARTOLA_API}/atletas/mercado`, {
      headers: { 'Authorization': req.headers['authorization'] || '' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Time do usuário
app.get('/time', async (req, res) => {
  try {
    const response = await axios.get(`${CARTOLA_API}/time/time-do-usuario`, {
      headers: { 'Authorization': req.headers['authorization'] || '' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Parciais
app.get('/parciais', async (req, res) => {
  try {
    const response = await axios.get(`${CARTOLA_API}/atletas/pontuados`, {
      headers: { 'Authorization': req.headers['authorization'] || '' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Partidas da rodada
app.get('/partidas', async (req, res) => {
  try {
    const response = await axios.get(`${CARTOLA_API}/partidas`, {
      headers: { 'Authorization': req.headers['authorization'] || '' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Salvar escalação
app.post('/escalar', async (req, res) => {
  try {
    const response = await axios.post(`${CARTOLA_API}/time/salvar`, req.body, {
      headers: {
        'Authorization': req.headers['authorization'] || '',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
