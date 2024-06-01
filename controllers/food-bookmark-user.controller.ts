import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodBookmark,
  User,
} from '../models';
import {FoodBookmarkRepository} from '../repositories';

export class FoodBookmarkUserController {
  constructor(
    @repository(FoodBookmarkRepository)
    public foodBookmarkRepository: FoodBookmarkRepository,
  ) { }

  @get('/food-bookmarks/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to FoodBookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof FoodBookmark.prototype.id,
  ): Promise<User> {
    return this.foodBookmarkRepository.user(id);
  }
}
