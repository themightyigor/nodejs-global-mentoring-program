import express, { Application, Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { joiSchema, validateSchemaMiddleware } from './middlewares/validation.middleware';
import { User } from '../models/User.model';
import { User as UserModel } from '../models/User.model';
import { UsersService } from '../services/users.service';

const router: Router = express.Router();

export const usersRouter = (app: Application,
    usersService: UsersService) => {
    app.use('/api/users', router);

    // @route    GET api/users/
    // @desc     Get all users
    router.get('/', async (req: Request, res: Response) => {
        try {
            const users: UserModel[] = await usersService.getUsers();
            res
                .status(200)
                .json({
                    userbase: users,
                });
        } catch (error) {
            res
                .status(400)
                .json({
                    message: `There's an error: ${error.message}`,
                });
        }
    });

    // @route    GET api/users/auto-suggest?limit=${number}&loginSubstring=${string}
    // @desc     GET auto suggested users
    router.get(('/auto-suggest'), async (req: Request, res: Response) => {
        const search = String(req.query.loginSubstring);
        const limit = Number(req.query.limit);
        try {
            const suggestedUsers: UserModel[] | null = await usersService.getSuggestedUsers(search, limit);
            if (suggestedUsers) {
                res
                    .status(200)
                    .json(suggestedUsers);

            } else {
                res
                    .status(404)
                    .json({
                        message: 'There are no users found',
                    });
            }
        } catch (error) {
            res
                .status(400)
                .json({
                    message: `There's an error: ${error.message}`,
                });
        }
    });

    // @route    GET api/users/:id
    // @desc     GET user by ID
    router.route('/:id')
        .get(async (req: Request, res: Response) => {
            try {
                const user: UserModel = await usersService.getUser(req.params.id);
                res
                    .status(200)
                    .json(user);
            } catch (error) {
                res
                    .status(400)
                    .json({
                        message: `There's an error: ${error.message}`,
                    });
            }
        })

    // @route    POST api/users/:id
    // @desc     Create a user
    router.post('/', validateSchemaMiddleware(joiSchema), async (req: Request, res: Response) => {
        const newUser: UserModel = req.body;
        try {
            const addedUserId = await usersService.createUser(newUser);
            res
                .status(201)
                .json({
                    message: `New user with id ${addedUserId} has been added to the userbase`,
                });
        } catch (error) {
            res
                .status(400)
                .json({
                    message: `There's an error: ${error.message}`,
                });
        }
    })

    // @route    PUT api/users/:id
    // @desc     Update a user
    router.put('/:id', validateSchemaMiddleware(joiSchema), async (req: Request, res: Response) => {
        const userToUpdate: UserModel = req.body;
        try {
            const updatedUserId: string = await usersService.updateUser(userToUpdate);
            res
                .status(200)
                .json({
                    message: `User with id ${updatedUserId} was succesfully edited`
                });
        } catch (error) {
            res
                .status(400)
                .json({
                    message: `There's an error: ${error.message}`,
                });
        }
    })

    // @route    DELETE api/users/:id
    // @desc     Delete a user
    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            const deletedUserId = await usersService.deleteUser(req.params.id);
            res
                .status(200)
                .json({
                    message: `User with id ${deletedUserId} was succesfully deleted`
                });
        } catch (error) {
            res
                .status(400)
                .json({
                    message: `There's an error: ${error.message}`,
                });
        }
    })
}

export { router };
