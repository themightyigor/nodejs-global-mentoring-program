import jwt from 'jsonwebtoken';

import { UserModel } from "../models/User.model";
import { UsersRepository } from "../data-access/users.repository";
import { NotFoundError } from "../errors/not-found.error";
import config from "../config";

export class UsersService {
    private usersRepository: UsersRepository;

    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    public async getUsers(): Promise<UserModel[]> {
        try {
            const userbase: UserModel[] = await this.usersRepository.getAll();
            return userbase;
        } catch (error) {
            throw error;
        }
    }

    public async getUser(userId: string): Promise<UserModel> {
        try {
            const user: UserModel = await this.usersRepository.findUserById(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async createUser(user: UserModel): Promise<string> {
        try {
            const newUserId: string = await this.usersRepository.addUser(user);
            return newUserId;
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(user: UserModel): Promise<string> {
        try {
            const updatedUserId: string = await this.usersRepository.updateUser(user);
            return updatedUserId;
        } catch (error) {
            throw error;
        }
    }

    public async deleteUser(userId: string): Promise<string> {
        try {
            const deletedUserId: string = await this.usersRepository.deleteUser(userId);
            return deletedUserId;
        } catch (error) {
            throw error;
        }
    }

    public async getSuggestedUsers(search: string, limit: number): Promise<UserModel[] | null> {
        const users: UserModel[] = await this.usersRepository.getAll();
        const suitedUsers: UserModel[] = users.filter(
            (user: UserModel) => user.login.includes(search),
        );

        if (suitedUsers.length === 0) {
            throw new NotFoundError('There are no users from auto-suggest');
        } else if (suitedUsers.length > limit) {
            const limitedSuitedUsers = suitedUsers.slice(0, limit);
            return limitedSuitedUsers;
        } else {
            return suitedUsers;
        }
    }

    public async authenticate(login: string, password: string): Promise<string> {
        try {
          await this.usersRepository.authenticate(login, password);
          const payload = {
            login,
          };
          const jwtSecret = config.jwtSecret as string;
          const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
          return token;
        } catch(error) {
          throw error;
        }
      }    
}