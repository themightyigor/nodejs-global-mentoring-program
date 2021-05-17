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

const app: Application = express();

app.listen(1337);

app.use(express.json());

const usersRepository = new UsersRepository(User);
const usersService = new UsersService(usersRepository);

const groupsRepository = new GroupsRepository(Group);
const groupsService = new GroupsService(groupsRepository);

const userGroupRepository = new UserGroupRepository(UserGroup, usersRepository, groupsRepository);
const userGroupService = new UserGroupService(userGroupRepository);

groupsRouter(app, groupsService);

userGroupRouter(app, userGroupService);

usersRouter(app, usersService);

