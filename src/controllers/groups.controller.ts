import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { GroupsService } from '../services/groups.service';
import { GroupModel } from '../models/Group.model';
import { groupValidator } from './middlewares/validators/group.validator';
import { wrapAsync } from '../utilities/wrap-async';

const router: Router = Router();

export const groupsRouter = (
  app: Application,
  groupsService: GroupsService
) => {

  app.use('/api/groups', router);

  router.get('/', wrapAsync(async (req: Request, res: Response) => {
    const groups: GroupModel[] = await groupsService.getGroups();
    res
      .status(200)
      .json({
        groups,
      });
  }));

  router.get('/:id', wrapAsync(async (req: Request, res: Response) => {
    const group: GroupModel = await groupsService.getGroup(req.params.id);
    res
      .status(200)
      .json(group);
  }));

  router.post('/:id', validateSchemaMiddleware(groupValidator), wrapAsync(async (req: Request, res: Response) => {
    const newGroup: GroupModel = req.body;
    const addedGroupId: string = await groupsService.createGroup(newGroup);
    res
      .status(201)
      .json({
        message: `New group with id ${addedGroupId} has been added to the groupbase`,
      });
  }));

  router.put('/:id', validateSchemaMiddleware(groupValidator), wrapAsync(async (req: Request, res: Response) => {
    const groupToUpdate: GroupModel = req.body;
    const updatedGroupId: string = await groupsService.updateGroup(groupToUpdate);
    res
      .status(200)
      .json({
        message: `Group with id ${updatedGroupId} was succesfully edited`
      });
  }));

  router.delete('/:id', wrapAsync(async (req: Request, res: Response) => {
    const deletedGroupId: string = await groupsService.deleteGroup(req.params.id);
    res
      .status(200)
      .json({
        message: `Group with id ${deletedGroupId} was succesfully deleted`
      });
  }));
}
