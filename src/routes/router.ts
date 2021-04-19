import express, { Router } from 'express';

import { router as users } from './api/users';

const router: Router = express.Router();
router.use('/users', users);

export { router };
