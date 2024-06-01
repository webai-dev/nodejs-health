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
  HealthMarkerMonitor,
} from '../models';
import {UserRepository} from '../repositories';

export class UserHealthMarkerMonitorController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/health-marker-monitors', {
    responses: {
      '200': {
        description: 'Array of User has many HealthMarkerMonitor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarkerMonitor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<HealthMarkerMonitor>,
  ): Promise<HealthMarkerMonitor[]> {
    return this.userRepository.healthMarkerMonitors(id).find(filter);
  }

  @post('/users/{id}/health-marker-monitors', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerMonitor)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitor, {
            title: 'NewHealthMarkerMonitorInUser',
            exclude: ['id'],
            optional: ['providerId']
          }),
        },
      },
    }) healthMarkerMonitor: Omit<HealthMarkerMonitor, 'id'>,
  ): Promise<HealthMarkerMonitor> {
    return this.userRepository.healthMarkerMonitors(id).create(healthMarkerMonitor);
  }

  @patch('/users/{id}/health-marker-monitors', {
    responses: {
      '200': {
        description: 'User.HealthMarkerMonitor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitor, {partial: true}),
        },
      },
    })
    healthMarkerMonitor: Partial<HealthMarkerMonitor>,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerMonitor)) where?: Where<HealthMarkerMonitor>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerMonitors(id).patch(healthMarkerMonitor, where);
  }

  @del('/users/{id}/health-marker-monitors', {
    responses: {
      '200': {
        description: 'User.HealthMarkerMonitor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerMonitor)) where?: Where<HealthMarkerMonitor>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerMonitors(id).delete(where);
  }
}
