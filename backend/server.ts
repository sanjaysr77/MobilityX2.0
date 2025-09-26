import express from 'express';
import dotenv from 'dotenv';

import queryRoutes from './routes/query.routes';
import recommendRoutes from './routes/recommend.routes';
import locationsRoutes from './routes/locations.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/query', queryRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/locations', locationsRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


