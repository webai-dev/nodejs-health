import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  GlucoseDevices,
  User,
} from '../models';
import {GlucoseDevicesRepository} from '../repositories';

export class GlucoseDevicesUserController {
  constructor(
    @repository(GlucoseDevicesRepository)
    public glucoseDevicesRepository: GlucoseDevicesRepository,
  ) { }

  @get('/glucose-devices/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to GlucoseDevices',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof GlucoseDevices.prototype.id,
  ): Promise<User> {
    return this.glucoseDevicesRepository.user(id);
  }
}
