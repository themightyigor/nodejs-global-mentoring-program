import express, { Application, Request, Response, Router } from 'express';

import { mockUsers } from '../../mock-users';
import { User } from '../../entities/User';
import { joiSchema, validateSchemaMiddleware } from '../../utils/validation';

const app: Application = express();
const router: Router = express.Router();

const USERS = 'userbase';
app.set(USERS, mockUsers);

// @route    GET api/users/
// @desc     Get all users
router.get('/', (req: Request, res: Response) => {
    res
        .status(200)
        .json({
            userbase: app.get(USERS)
        });
});

// @route    GET api/users/auto-suggest?limit=${number}&loginSubstring=${string}
// @desc     GET auto suggested users
router.get(('/auto-suggest'), (req: Request, res: Response) => {
    console.log('here')
    const loginSubstring = String(req.query.loginSubstring);
    const limit = Number(req.query.limit);
    const users: User[] = app.get(USERS).filter(
        (user: User) => user.login.includes(loginSubstring)
    );
    if (users.length === 0) {
        res
            .status(404)
            .json({
                message: 'There are no users found'
            });
    } else if (users.length > limit) {
        const indexForSplice = limit - 1;
        const slicedUsers = users.slice(indexForSplice);
        res
            .status(200)
            .json(slicedUsers);
    } else {
        res
            .status(200)
            .json(users);
    }
});

// @route    GET api/users/:id
// @desc     GET user by ID
router.route('/:id')
    .get((req: Request, res: Response) => {
        const existingUser: User = app.get(USERS).find(
            (user: User) => user.id === req.params.id
        );
        if (existingUser) {
            res
                .status(200)
                .json(existingUser);
        } else {
            res
                .status(404)
                .json({
                    message: `User Not Found`
                });
        }
    })

// @route    POST api/users/:id
// @desc     Create a user
router.post(':/id', validateSchemaMiddleware(joiSchema), (req: Request, res: Response) => {
    const newUser: User = req.body;
    const existingUser: User = app.get(USERS).find(
        (user: User) => user.id === req.params.id
    );
    if (req.params.id !== newUser.id) {
        res
            .status(400)
            .json({
                message: `Invalid user ID`
            });
    } else if (existingUser) {
        res
            .status(400)
            .json({
                message: `User already exists`
            });
    } else {
        const updatedUserbase: User[] = [...app.get(USERS), newUser];
        app.set(USERS, updatedUserbase);
        res
            .status(201)
            .json({
                message: `The user was successfully created`
            });
    }
})

// @route    PUT api/users/:id
// @desc     Update a user
router.put(':/id', validateSchemaMiddleware(joiSchema), (req: Request, res: Response) => {
    const userToUpdate: User = req.body;
    const existingUser: User = app.get(USERS).find(
        (user: User) => user.id === req.params.id
    );
    if (req.params.id !== userToUpdate.id) {
        res
            .status(400)
            .json({
                message: `Invalid user ID`
            });
    } else if (!existingUser) {
        res
            .status(400)
            .json({
                message: `User with id ${userToUpdate.id} doesn't exist in the database`
            });
    } else if (existingUser && existingUser.isDeleted) {
        res
            .status(400)
            .json({
                message: `User was successfully been deleted`
            });
    } else {
        const updatedUserbase = app.get(USERS).map(
            (user: User) => user.id === userToUpdate.id ? userToUpdate : user
        );
        app.set(USERS, updatedUserbase);
        res
            .status(200)
            .json({
                message: `User was succesfully edited`
            });
    }
})

// @route    DELETE api/users/:id
// @desc     Delete a user
router.delete(':/id', (req: Request, res: Response) => {
    const existingUser: User = app.get(USERS).find(
        (user: User) => user.id === req.params.id
    );
    if (!existingUser) {
        res
            .status(404)
            .json({
                message: `No User Found`
            });
    } else if (existingUser && existingUser.isDeleted) {
        res
            .status(400)
            .json({
                message: `Ooops! The user has already been deleted`
            });
    } else {
        const updatedUserbase = app.get(USERS).map(
            (user: User) => user.id === existingUser.id ? { ...existingUser, isDeleted: true } : user
        );
        app.set(USERS, updatedUserbase);
        res
            .status(200)
            .json({
                message: `User with was succesfully deleted`
            });
    }
});

export { router };
