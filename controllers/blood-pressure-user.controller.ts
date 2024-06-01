import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BloodPressure,
  User,
} from '../models';
import {BloodPressureRepository} from '../repositories';

export class BloodPressureUserController {
  constructor(
    @repository(BloodPressureRepository)
    public bloodPressureRepository: BloodPressureRepository,
  ) { }

  @get('/blood-pressures/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to BloodPressure',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof BloodPressure.prototype.id,
  ): Promise<User> {
    return this.bloodPressureRepository.user(id);
  }
}
