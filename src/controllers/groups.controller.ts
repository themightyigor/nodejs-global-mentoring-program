import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { GroupsService } from '../services/groups.service';
import { GroupModel } from '../models/Group.model';
import { groupValidator } from './middlewares/validators/group.validator';

const router: Router = Router();

export const groupsRouter = (
  app: Application,
  groupsService: GroupsService
) => {

  app.use('/api/groups', router);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const groups: GroupModel[] = await groupsService.getGroupbase();
      res
        .status(200)
        .json({
          message: 'Welcome to the awesome groupbase',
          groupbase: groups,
        });
    } catch (error) {
      res
        .status(400)
        .json({
          message: `There's an error: ${error.message}`,
        });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const group: GroupModel = await groupsService.getGroup(req.params.id);
      res
        .status(200)
        .json(group);
    } catch (error) {
      res
        .status(400)
        .json({
          message: `There's an error: ${error.message}`,
        });
    }
  })

  router.post('/:id', validateSchemaMiddleware(groupValidator), async (req: Request, res: Response) => {
    const newGroup: GroupModel = req.body;
    try {
      const addedGroupId: string = await groupsService.createGroup(newGroup);
      res
        .status(201)
        .json({
          message: `New group with id ${addedGroupId} has been added to the groupbase`,
        });
    } catch (error) {
      res
        .status(400)
        .json({
          message: `There's an error: ${error.message}`,
        });
    }
  })

  router.put('/:id', validateSchemaMiddleware(groupValidator), async (req: Request, res: Response) => {
    const groupToUpdate: GroupModel = req.body;
    try {
      const updatedGroupId: string = await groupsService.updateGroup(groupToUpdate);
      res
        .status(200)
        .json({
          message: `Group with id ${updatedGroupId} was succesfully edited`
        });
    } catch (error) {
      res
        .status(400)
        .json({
          message: `There's an error: ${error.message}`,
        });
    }
  })

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedGroupId: string = await groupsService.deleteGroup(req.params.id);
      res
        .status(200)
        .json({
          message: `Group with id ${deletedGroupId} was succesfully deleted`
        });
    } catch (error) {
      res
        .status(400)
        .json({
          message: `There's an error: ${error.message}`,
        });
    }
  });
}
