import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserCharacteristics, UserCharacteristicsRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class UserCharacteristicsRepository extends DefaultCrudRepository<
  UserCharacteristics,
  typeof UserCharacteristics.prototype.id,
  UserCharacteristicsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserCharacteristics.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserCharacteristics, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
