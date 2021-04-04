import express, { Application } from 'express';
import { router } from './routes/router';

const app: Application = express();

app.use(express.json());

app.use('/api', router);

const port = process.env.port || 1337;

app.listen(port, () => console.log(`Server started on port ${port}`));
