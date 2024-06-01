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
  Cholesterol,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCholesterolController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/cholesterols', {
    responses: {
      '200': {
        description: 'Array of User has many Cholesterol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cholesterol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Cholesterol>,
  ): Promise<Cholesterol[]> {
    return this.userRepository.cholesterols(id).find(filter);
  }

  @post('/users/{id}/cholesterols', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cholesterol)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cholesterol, {
            title: 'NewCholesterolInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) cholesterol: Omit<Cholesterol, 'id'>,
  ): Promise<Cholesterol> {
    return this.userRepository.cholesterols(id).create(cholesterol);
  }

  @patch('/users/{id}/cholesterols', {
    responses: {
      '200': {
        description: 'User.Cholesterol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cholesterol, {partial: true}),
        },
      },
    })
    cholesterol: Partial<Cholesterol>,
    @param.query.object('where', getWhereSchemaFor(Cholesterol)) where?: Where<Cholesterol>,
  ): Promise<Count> {
    return this.userRepository.cholesterols(id).patch(cholesterol, where);
  }

  @del('/users/{id}/cholesterols', {
    responses: {
      '200': {
        description: 'User.Cholesterol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Cholesterol)) where?: Where<Cholesterol>,
  ): Promise<Count> {
    return this.userRepository.cholesterols(id).delete(where);
  }
}
