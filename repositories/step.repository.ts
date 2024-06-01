import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Step, StepRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class StepRepository extends DefaultCrudRepository<
  Step,
  typeof Step.prototype.id,
  StepRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Step.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Step, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
