import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Role, RoleRelations, UserRole} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRoleRepository} from './user-role.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly userRoles: HasManyRepositoryFactory<UserRole, typeof Role.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
  ) {
    super(Role, dataSource);
    this.userRoles = this.createHasManyRepositoryFactoryFor('userRoles', userRoleRepositoryGetter,);
    this.registerInclusionResolver('userRoles', this.userRoles.inclusionResolver);
  }
}
