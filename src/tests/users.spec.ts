import request from 'supertest';
import express, { Application } from 'express';

import { usersRouter } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { UserModel } from '../models/User.model';

describe('usersRouter', () => {
  const mockUsers = 'users';
  const mockToken = '123456';
  const mockUser = 'user';
  const mockUserId = '1';
  const loginMock = 'login';
  const passwordMock = 'password1';
  const requestBodyMock: UserModel = {
    login: loginMock,
    password: passwordMock,
    id: mockUserId,
    age: 41,
    isDeleted: false,
  };
  const userIdQueryMock = '1';
  const getUsers = jest.fn().mockReturnValue(Promise.resolve(mockUsers));
  const authenticate = jest.fn().mockReturnValue(Promise.resolve(mockToken));
  const getUser = jest.fn().mockReturnValue(Promise.resolve(mockUser));
  const createUser = jest.fn().mockReturnValue(Promise.resolve(mockUserId));
  const updateUser = jest.fn().mockReturnValue(Promise.resolve(mockUserId));
  const deleteUser = jest.fn().mockReturnValue(Promise.resolve(mockUserId));

  let app: Application;
  let usersServiceMock: UsersService;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    usersServiceMock = {
      getUsers,
      authenticate,
      getUser,
      createUser,
      updateUser,
      deleteUser,
    } as unknown as UsersService;

    usersRouter(app, usersServiceMock);
  });

  it('should get users', (done) => {
    request(app)
      .get('/users')
      .expect(() => {
        expect(getUsers).toHaveBeenCalledTimes(1);
      })
      .expect(
        200,
        {
          mockUsers,
        },
        done,
      );
  });

  it('should send authentication token', (done) => {
    request(app)
      .get('/users/login')
      .send(requestBodyMock)
      .expect(() => {
        expect(authenticate).toHaveBeenCalledTimes(1);
        expect(authenticate).toHaveBeenCalledWith(loginMock, passwordMock);
      })
      .expect(
        200,
        {
          token: mockToken,
        },
        done,
      );
  });

  it('should get user', (done) => {
    request(app)
      .get(`/userbase/${userIdQueryMock}`)
      .expect(() => {
        expect(getUser).toHaveBeenCalledTimes(1);
        expect(getUser).toHaveBeenCalledWith(userIdQueryMock);
      })
      .expect(
        200,
        `"${mockUser}"`,
        done,
      );
  });

  it('should create new user', (done) => {
    request(app)
      .post(`/users/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect(() => {
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith(requestBodyMock);
      })
      .expect(
        201,
        {
          message: `New user with id ${mockUserId} has been added to the userbase`,
        },
        done,
      );
  });

  it('should edit the user', (done) => {
    request(app)
      .put(`/users/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect(() => {
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith(requestBodyMock);
      })
      .expect(
        200,
        {
          message: `User with id ${mockUserId} was succesfully edited`,
        },
        done,
      );
  });

  it('should delete user', (done) => {
    request(app)
      .delete(`/users/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect(() => {
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(deleteUser).toHaveBeenCalledWith(userIdQueryMock);
      })
      .expect(
        200,
        {
          message: `User with id ${mockUserId} was succesfully deleted`,
        },
        done,
      );
  });
});