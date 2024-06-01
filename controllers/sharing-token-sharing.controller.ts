import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SharingToken,
  Sharing,
} from '../models';
import {SharingTokenRepository} from '../repositories';

export class SharingTokenSharingController {
  constructor(
    @repository(SharingTokenRepository)
    public sharingTokenRepository: SharingTokenRepository,
  ) { }

  @get('/sharing-tokens/{id}/sharing', {
    responses: {
      '200': {
        description: 'Sharing belonging to SharingToken',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Sharing)},
          },
        },
      },
    },
  })
  async getSharing(
    @param.path.number('id') id: typeof SharingToken.prototype.id,
  ): Promise<Sharing> {
    return this.sharingTokenRepository.sharing(id);
  }
}
