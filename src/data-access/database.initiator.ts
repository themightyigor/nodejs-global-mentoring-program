import { Sequelize, Options, Model, DataTypes } from 'sequelize';
import { User as UserModel } from '../models/User.model';
import { mockUsers } from './mock-users';
import config from '../config';


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


const sequelize: Sequelize = new Sequelize(DATABASE_CONFIG);

sequelize.authenticate()
    .then(() => console.log('Connected successfully'))
    .catch((error) => console.error(console.error('Unable to connect to the database:', error)
    ));

export class User extends Model implements UserModel {
    public id!: string;
    public login!: string;
    public password!: string;
    public age!: number;
    public isDeleted!: boolean;
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

User.sync({ force: true })
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
                    .then((user: UserModel) => console.log(`${user.login} was successfully added to the database`))
                    .catch((error: Error) => console.error(error.message));
            })
        })(mockUsers);
    })
    .catch((error: Error) => console.error(error.message));
