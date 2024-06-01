import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SharingToken, SharingTokenRelations, Sharing} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SharingRepository} from './sharing.repository';

export class SharingTokenRepository extends DefaultCrudRepository<
  SharingToken,
  typeof SharingToken.prototype.id,
  SharingTokenRelations
> {

  public readonly sharing: BelongsToAccessor<Sharing, typeof SharingToken.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SharingRepository') protected sharingRepositoryGetter: Getter<SharingRepository>,
  ) {
    super(SharingToken, dataSource);
    this.sharing = this.createBelongsToAccessorFor('sharing', sharingRepositoryGetter,);
    this.registerInclusionResolver('sharing', this.sharing.inclusionResolver);
  }
}
