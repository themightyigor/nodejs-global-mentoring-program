import { Sequelize, Options, Model, DataTypes, HasManyAddAssociationMixin } from 'sequelize';

import config from '../config';
import { GroupModel, Permission } from '../models/Group.model';
import { mockUsers } from './mock-users';
import { UserModel } from '../models/User.model';
import { UserGroupModel } from '../models/UserGroup.model';

const DATABASE_CONFIG: Options = {
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

export const sequelize: Sequelize = new Sequelize(DATABASE_CONFIG);

sequelize.authenticate()
  .then(() => console.log('Connected successfully'))
  .catch((error: Error) => console.error(console.error('Unable to connect to the database:', error)
  ));

export class User extends Model implements UserModel {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;
  public addGroup!: HasManyAddAssociationMixin<Group, string>;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

export class Group extends Model implements GroupModel {
  public id!: string;
  public name!: string;
  public permissions!: Array<Permission>;

  public addUser!: HasManyAddAssociationMixin<User, string>;
}

Group.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    tableName: 'groups',
    sequelize,
  }
);

export class UserGroup extends Model implements UserGroupModel {
  public userId!: string;
  public groupId!: string;
}

UserGroup.init(
  {
    UserId: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: User,
        key: 'id',
      }
    },
    GroupId: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: Group,
        key: 'id',
      }
    },
  },
  {
    tableName: 'usersgroups',
    sequelize,
  }
);

const userModelSync = User.sync({ force: true })
  .then(() => {
    (function populateUsersTable(users) {
      users.forEach((user: UserModel) => {
        User.create({
          id: user.id,
          login: user.login,
          password: user.password,
          age: user.age,
          isDeleted: user.isDeleted,
        })
          .then((user: UserModel) => console.log(`${user.login} was successfully added to the users database`))
          .catch((error: Error) => console.error(error.message));
      })
    })(mockUsers);
  });

const groupModelSync = Group.sync()
  .then(() => console.log('Groups table synced'));

Promise.all([userModelSync, groupModelSync]).then(() => {
  UserGroup.sync({ force: true })
    .then(() => {
      console.log('UsersGroup table synced');
      User.belongsToMany(Group, { through: UserGroup });
      Group.belongsToMany(User, { through: UserGroup });
    })
    .catch((error: Error) => console.error(error.message));
});
