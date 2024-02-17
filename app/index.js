const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Configurar a engine de visualização EJS
app.set('view engine', 'ejs');

const buscarTopCriptos = async () => {
  try {
    const responseLista = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });

    return responseLista.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Limite de taxa excedido. Aguarde antes de fazer a próxima solicitação.');
    } else {
      console.error('Erro ao buscar criptomoedas:', error.message);
    }
    return [];
  }
};

const buscarTopNFTs = async () => {
  try {
    // Faz a chamada à API
    const responseNFTs = await axios.get('https://api.coingecko.com/api/v3/nfts/list', {
      params: {
        per_page: 10,
        page: 1,
      },
    });

    // Filtra e retorna apenas os top 10 NFTs
    const topNFTs = responseNFTs.data.slice(0, 10);

    return topNFTs;
  } catch (error) {
    console.error('Erro ao buscar NFTs:', error.message);
    return [];
  }
};

// Combine ambas as funções de busca de dados em um único manipulador de rota
app.get('/', async (req, res) => {
  try {
    // Busca tanto as criptomoedas quanto os NFTs
    const criptos = await buscarTopCriptos();
    const nfts = await buscarTopNFTs();

    // Renderiza o modelo com os dados
    res.render('index', { criptos, nfts });
  } catch (error) {
    console.error('Erro ao renderizar a página:', error.message);
    res.status(500).send('Erro interno do servidor');
  }
});



// Periodic task for fetching NFTs every 5 minutes
setInterval(buscarTopNFTs, 300000);
// Realizar a busca a cada 5 minutos (300.000 milissegundos)
setInterval(buscarTopCriptos, 300000);


const path = require('path');



// Configurando para servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
app.use(express.static('public'));

