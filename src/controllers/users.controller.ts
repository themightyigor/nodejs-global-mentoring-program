import express, { Application, Request, Response, Router } from 'express';

import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { UserModel } from '../models/User.model';
import { UsersService } from '../services/users.service';
import { userValidator } from './middlewares/validators/user.validator';
import { wrapAsync } from '../utilities/wrap-async';

const router: Router = express.Router();

export const usersRouter = (app: Application,
    usersService: UsersService) => {
    app.use('/api/users', router);

    // @route    GET api/users/
    // @desc     Get all users
    router.get('/', wrapAsync(async (req: Request, res: Response) => {
        const users: UserModel[] = await usersService.getUsers();
        res
            .status(200)
            .json({
                users,
            });
    }));

    // @route    GET api/users/logiin
    // @desc     GET user's JWT Token

    router.get('/login', validateSchemaMiddleware(userValidator), wrapAsync(async (req: Request, res: Response) => {
        const login: string = req.body.login;
        const password: string = req.body.password;
        const token: string = await usersService.authenticate(login, password);
        res
            .status(200)
            .json({
                token,
            });
    }));

    // @route    GET api/users/auto-suggest?limit=${number}&loginSubstring=${string}
    // @desc     GET auto suggested users
    router.get(('/auto-suggest'), wrapAsync(async (req: Request, res: Response) => {
        const search = String(req.query.loginSubstring);
        const limit = Number(req.query.limit);
        const suggestedUsers: UserModel[] | null = await usersService.getSuggestedUsers(search, limit);
        res
            .status(200)
            .json(suggestedUsers);
    }));

    // @route    GET api/users/:id
    // @desc     GET user by ID
    router.route('/:id')
        .get(wrapAsync(async (req: Request, res: Response) => {
            const user: UserModel = await usersService.getUser(req.params.id);
            res
                .status(200)
                .json(user);
        }));

    // @route    POST api/users/:id
    // @desc     Create a user
    router.post('/', validateSchemaMiddleware(userValidator), wrapAsync(async (req: Request, res: Response) => {
        const newUser: UserModel = req.body;
        const addedUserId = await usersService.createUser(newUser);
        res
            .status(201)
            .json({
                message: `New user with id ${addedUserId} has been added to the userbase`,
            });
    }));

    // @route    PUT api/users/:id
    // @desc     Update a user
    router.put('/:id', validateSchemaMiddleware(userValidator), wrapAsync(async (req: Request, res: Response) => {
        const userToUpdate: UserModel = req.body;
        const updatedUserId: string = await usersService.updateUser(userToUpdate);
        res
            .status(200)
            .json({
                message: `User with id ${updatedUserId} was succesfully edited`
            });
    }));

    // @route    DELETE api/users/:id
    // @desc     Delete a user
    router.delete('/:id', wrapAsync(async (req: Request, res: Response) => {
        const deletedUserId = await usersService.deleteUser(req.params.id);
        res
            .status(200)
            .json({
                message: `User with id ${deletedUserId} was succesfully deleted`
            });
    }));
}

export { router };
