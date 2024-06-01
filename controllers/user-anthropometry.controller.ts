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
  Anthropometry,
} from '../models';
import {UserRepository} from '../repositories';

export class UserAnthropometryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/anthropometries', {
    responses: {
      '200': {
        description: 'Array of User has many Anthropometry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Anthropometry)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Anthropometry>,
  ): Promise<Anthropometry[]> {
    return this.userRepository.anthropometries(id).find(filter);
  }

  @post('/users/{id}/anthropometries', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Anthropometry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Anthropometry, {
            title: 'NewAnthropometryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) anthropometry: Omit<Anthropometry, 'id'>,
  ): Promise<Anthropometry> {
    return this.userRepository.anthropometries(id).create(anthropometry);
  }

  @patch('/users/{id}/anthropometries', {
    responses: {
      '200': {
        description: 'User.Anthropometry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Anthropometry, {partial: true}),
        },
      },
    })
    anthropometry: Partial<Anthropometry>,
    @param.query.object('where', getWhereSchemaFor(Anthropometry)) where?: Where<Anthropometry>,
  ): Promise<Count> {
    return this.userRepository.anthropometries(id).patch(anthropometry, where);
  }

  @del('/users/{id}/anthropometries', {
    responses: {
      '200': {
        description: 'User.Anthropometry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Anthropometry)) where?: Where<Anthropometry>,
  ): Promise<Count> {
    return this.userRepository.anthropometries(id).delete(where);
  }
}
