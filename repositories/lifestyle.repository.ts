import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Lifestyle, LifestyleRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class LifestyleRepository extends DefaultCrudRepository<
  Lifestyle,
  typeof Lifestyle.prototype.id,
  LifestyleRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Lifestyle.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Lifestyle, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
