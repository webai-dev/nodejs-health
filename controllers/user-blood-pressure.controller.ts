import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  BloodPressure,
} from '../models';
import {UserRepository} from '../repositories';

export class UserBloodPressureController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/blood-pressures', {
    responses: {
      '200': {
        description: 'Array of User has many BloodPressure',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BloodPressure)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<BloodPressure>,
  ): Promise<BloodPressure[]> {
    return this.userRepository.bloodPressures(id).find(filter);
  }

  @post('/users/{id}/blood-pressures', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(BloodPressure)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BloodPressure, {
            title: 'NewBloodPressureInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) bloodPressure: Omit<BloodPressure, 'id'>,
  ): Promise<BloodPressure> {
    return this.userRepository.bloodPressures(id).create(bloodPressure);
  }

  @patch('/users/{id}/blood-pressures', {
    responses: {
      '200': {
        description: 'User.BloodPressure PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BloodPressure, {partial: true}),
        },
      },
    })
    bloodPressure: Partial<BloodPressure>,
    @param.query.object('where', getWhereSchemaFor(BloodPressure)) where?: Where<BloodPressure>,
  ): Promise<Count> {
    return this.userRepository.bloodPressures(id).patch(bloodPressure, where);
  }

  @del('/users/{id}/blood-pressures', {
    responses: {
      '200': {
        description: 'User.BloodPressure DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(BloodPressure)) where?: Where<BloodPressure>,
  ): Promise<Count> {
    return this.userRepository.bloodPressures(id).delete(where);
  }
}
