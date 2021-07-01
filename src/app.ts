import express, { Application } from 'express';

import { usersRouter } from './controllers/users.controller';
import { UsersRepository } from './data-access/users.repository';
import { User, Group, UserGroup } from './data-access/database.initiator';
import { UsersService } from './services/users.service';
import { GroupsRepository } from './data-access/groups.repository';
import { GroupsService } from './services/groups.service';
import { groupsRouter } from './controllers/groups.controller';
import { userGroupRouter } from './controllers/user-group.controller';
import { UserGroupService } from './services/user-group.service';
import { UserGroupRepository } from './data-access/user-group.repository';
import { requestInfoMiddleware } from './controllers/middlewares/request-info.middleware';
import { unhandledErrorsMiddleware } from './controllers/middlewares/unhandled-errors.middleware';
import { errorsHandlerMiddleware } from './controllers/middlewares/error-handler.middleware';
import { errorLogger } from './loggers/error.logger';

const app: Application = express();

app.listen(1337);

app.use(express.json());
app.use(requestInfoMiddleware);

const usersRepository = new UsersRepository(User);
const usersService = new UsersService(usersRepository);

const groupsRepository = new GroupsRepository(Group);
const groupsService = new GroupsService(groupsRepository);

const userGroupRepository = new UserGroupRepository(UserGroup, usersRepository, groupsRepository);
const userGroupService = new UserGroupService(userGroupRepository);

groupsRouter(app, groupsService);

userGroupRouter(app, userGroupService);

usersRouter(app, usersService);

app.use(errorsHandlerMiddleware);

app.use(unhandledErrorsMiddleware);

process
  .on('unhandledRejection', (error: Error) => {
    errorLogger.error(error);
  })
  .on('uncaughtException', (error: Error) => {
    errorLogger.error(error);
  });
