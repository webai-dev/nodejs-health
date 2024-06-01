import {DefaultCrudRepository} from '@loopback/repository';
import {UserCode, UserCodeRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserCodeRepository extends DefaultCrudRepository<
  UserCode,
  typeof UserCode.prototype.id,
  UserCodeRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(UserCode, dataSource);
  }
}
