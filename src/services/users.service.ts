import { User as UserModel } from "../models/User.model";
import { UsersRepository } from "../data-access/users.repository";

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
            return null;
        } else if (suitedUsers.length > limit) {
            const limitedSuitedUsers = suitedUsers.slice(0, limit);
            return limitedSuitedUsers;
        } else {
            return suitedUsers;
        }
    }
}