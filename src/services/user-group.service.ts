import { UserGroupRepository } from "../data-access/user-group.repository";
import { UserGroupModel } from "../models/UserGroup.model";

export class UserGroupService {
  private userGroupRepository: UserGroupRepository;

  constructor(userGroupRepository: UserGroupRepository) {
    this.userGroupRepository = userGroupRepository;
  }

  public async getUsersGroups(): Promise<UserGroupModel[]> {
    try {
      const usersAndGroups: UserGroupModel[] = await this.userGroupRepository.getAll();
      return usersAndGroups;
    } catch (error) {
      throw error;
    }
  }

  public async addUsersToGroup(groupId: string, userIdsRaw: string): Promise<void> {
    const userIds = userIdsRaw.split(',');
    try {
      await this.userGroupRepository.addUsersToGroup(groupId, userIds);
    } catch (error) {
      throw (error);
    }
  }
}
