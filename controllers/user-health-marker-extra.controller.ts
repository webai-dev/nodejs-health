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
  HealthMarkerExtra,
} from '../models';
import {UserRepository} from '../repositories';

export class UserHealthMarkerExtraController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/health-marker-extras', {
    responses: {
      '200': {
        description: 'Array of User has many HealthMarkerExtra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarkerExtra)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<HealthMarkerExtra>,
  ): Promise<HealthMarkerExtra[]> {
    return this.userRepository.healthMarkerExtras(id).find(filter);
  }

  @post('/users/{id}/health-marker-extras', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerExtra)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerExtra, {
            title: 'NewHealthMarkerExtraInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) healthMarkerExtra: Omit<HealthMarkerExtra, 'id'>,
  ): Promise<HealthMarkerExtra> {
    return this.userRepository.healthMarkerExtras(id).create(healthMarkerExtra);
  }

  @patch('/users/{id}/health-marker-extras', {
    responses: {
      '200': {
        description: 'User.HealthMarkerExtra PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerExtra, {partial: true}),
        },
      },
    })
    healthMarkerExtra: Partial<HealthMarkerExtra>,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerExtra)) where?: Where<HealthMarkerExtra>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerExtras(id).patch(healthMarkerExtra, where);
  }

  @del('/users/{id}/health-marker-extras', {
    responses: {
      '200': {
        description: 'User.HealthMarkerExtra DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerExtra)) where?: Where<HealthMarkerExtra>,
  ): Promise<Count> {
    return this.userRepository.healthMarkerExtras(id).delete(where);
  }
}
