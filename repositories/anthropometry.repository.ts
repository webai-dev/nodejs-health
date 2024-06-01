import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Anthropometry, AnthropometryRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class AnthropometryRepository extends DefaultCrudRepository<
  Anthropometry,
  typeof Anthropometry.prototype.id,
  AnthropometryRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Anthropometry.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Anthropometry, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
