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
  InsulinInjections,
} from '../models';
import {UserRepository} from '../repositories';

export class UserInsulinInjectionsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/insulin-injections', {
    responses: {
      '200': {
        description: 'Array of User has many InsulinInjections',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(InsulinInjections)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<InsulinInjections>,
  ): Promise<InsulinInjections[]> {
    return this.userRepository.insulinInjections(id).find(filter);
  }

  @post('/users/{id}/insulin-injections', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(InsulinInjections)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsulinInjections, {
            title: 'NewInsulinInjectionsInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) insulinInjections: Omit<InsulinInjections, 'id'>,
  ): Promise<InsulinInjections> {
    return this.userRepository.insulinInjections(id).create(insulinInjections);
  }

  @patch('/users/{id}/insulin-injections', {
    responses: {
      '200': {
        description: 'User.InsulinInjections PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsulinInjections, {partial: true}),
        },
      },
    })
    insulinInjections: Partial<InsulinInjections>,
    @param.query.object('where', getWhereSchemaFor(InsulinInjections)) where?: Where<InsulinInjections>,
  ): Promise<Count> {
    return this.userRepository.insulinInjections(id).patch(insulinInjections, where);
  }

  @del('/users/{id}/insulin-injections', {
    responses: {
      '200': {
        description: 'User.InsulinInjections DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InsulinInjections)) where?: Where<InsulinInjections>,
  ): Promise<Count> {
    return this.userRepository.insulinInjections(id).delete(where);
  }
}
