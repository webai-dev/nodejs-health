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
  HealthMarkerInterval,
} from '../models';
import {UserRepository} from '../repositories';

export class UserHealthMarkerIntervalController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'Array of User has many HealthMarkerInterval',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarkerInterval)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<HealthMarkerInterval>,
  ): Promise<HealthMarkerInterval[]> {
    return this.userRepository.healthMarkerIntervals(id).find(filter);
  }

  @post('/users/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerInterval)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {
            title: 'NewHealthMarkerIntervalInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) healthMarkerInterval: Omit<HealthMarkerInterval, 'id'>,
  ): Promise<HealthMarkerInterval> {
    return this.userRepository.healthMarkerIntervals(id).create(healthMarkerInterval);
  }

  @patch('/users/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'User.HealthMarkerInterval PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {partial: true}),
        },
      },
    })
    healthMarkerInterval: Partial<HealthMarkerInterval>,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerInterval)) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerIntervals(id).patch(healthMarkerInterval, where);
  }

  @del('/users/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'User.HealthMarkerInterval DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerInterval)) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerIntervals(id).delete(where);
  }
}
