import express, { Request, Response } from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express Server in Project 1!' });
});

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log("Server running on port " + port);
  });
}
