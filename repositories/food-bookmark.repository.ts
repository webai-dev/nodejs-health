import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodBookmark, FoodBookmarkRelations, Food, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {UserRepository} from './user.repository';

export class FoodBookmarkRepository extends DefaultCrudRepository<
  FoodBookmark,
  typeof FoodBookmark.prototype.id,
  FoodBookmarkRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodBookmark.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof FoodBookmark.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(FoodBookmark, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
