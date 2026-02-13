import express from 'express';
import { createServer } from 'vite';

const app = express();

app.get('/api/nfts', async (req, res) => {
  const { owner } = req.query;
  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!owner) {
    return res.status(400).json({ error: 'Missing owner parameter' });
  }
  if (!apiKey) {
    return res.status(500).json({ error: 'Alchemy API key not configured' });
  }

  const contractAddress = '0x7256de5b154e4242c989fa089c66f153f758335c';
  const url = `https://apechain-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${owner}&contractAddresses[]=${contractAddress}&withMetadata=true&pageSize=100`;

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(vite.middlewares);

app.listen(5000, '0.0.0.0', () => {
  console.log('Dev server running on http://0.0.0.0:5000');
});
