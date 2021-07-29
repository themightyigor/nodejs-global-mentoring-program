import { UserModel } from "./models/User.model";

export const mockUsers: UserModel[] = [
    {
        id: '1',
        login: 'RubberMan',
        password: '123456',
        age: 1,
        isDeleted: false
    },
    {
        id: '2',
        login: 'Celeritas',
        password: '123456',
        age: 2,
        isDeleted: true
    },
    {
        id: '3',
        login: 'Dynama',
        password: '123456',
        age: 3,
        isDeleted: false
    },
    {
        id: '4',
        login: 'Tornado',
        password: '123456',
        age: 4,
        isDeleted: true
    }
];
