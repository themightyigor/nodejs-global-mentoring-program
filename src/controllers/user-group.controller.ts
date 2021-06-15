import { Application, Router, Request, Response } from 'express';
import { UserGroupService } from '../services/user-group.service';
import { UserGroupModel } from '../models/UserGroup.model';
import { wrapAsync } from '../utilities/wrap-async';

export const router: Router = Router();

// for example: GET /user-group?groupId=${number}&userIds=${number, number, number}
// for example: GET /user-group?groupId=1&userIds=2,4

export const userGroupRouter = (
  app: Application,
  userGroupService: UserGroupService,
) => {
  app.use('/api/user-group', router);

  router.get('/', wrapAsync(async (req: Request, res: Response) => {
    const groupId = req.query.groupId as string;
    const userIdsRaw = req.query.userIds as string;
    await userGroupService.addUsersToGroup(groupId, userIdsRaw);
    res
      .status(200)
      .json({
        message: `Users with ids: ${userIdsRaw} was successfully added to the group with id: ${groupId}`,
      });
  }));

  router.get('/show', wrapAsync(async (req: Request, res: Response) => {
    const usersGroups: UserGroupModel[] = await userGroupService.getUsersGroups();
    res
      .status(200)
      .json({
        message: 'Here relations between users and groups',
        usersGroups,
      });
  }));
}
