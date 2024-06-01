import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Calories, CaloriesRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class CaloriesRepository extends DefaultCrudRepository<
  Calories,
  typeof Calories.prototype.id,
  CaloriesRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Calories.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Calories, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
