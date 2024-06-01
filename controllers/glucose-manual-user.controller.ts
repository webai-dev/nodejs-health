import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  GlucoseManual,
  User,
} from '../models';
import {GlucoseManualRepository} from '../repositories';

export class GlucoseManualUserController {
  constructor(
    @repository(GlucoseManualRepository)
    public glucoseManualRepository: GlucoseManualRepository,
  ) { }

  @get('/glucose-manuals/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to GlucoseManual',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof GlucoseManual.prototype.id,
  ): Promise<User> {
    return this.glucoseManualRepository.user(id);
  }
}
