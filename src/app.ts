import express, { Application } from 'express';

import { usersRouter } from './controllers/users.controller';
// import { autosuggestRouter } from './controllers/auto-suggest.controller';
import { UsersRepository } from './data-access/users.repository';
import { User } from './data-access/database.initiator';
// import { AutoSuggestService } from './services/auto-suggest.service';
import { UsersService } from './services/users.service';

const app: Application = express();

app.listen(1337);

app.use(express.json());

const usersRepository = new UsersRepository(User);
const usersService = new UsersService(usersRepository);
// const autoSuggestService = new AutoSuggestService(usersRepository);

usersRouter(app, usersService);

// autosuggestRouter(app, autoSuggestService);
