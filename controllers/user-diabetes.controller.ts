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
  Diabetes,
} from '../models';
import {UserRepository} from '../repositories';

export class UserDiabetesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/diabetes', {
    responses: {
      '200': {
        description: 'Array of User has many Diabetes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diabetes)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Diabetes>,
  ): Promise<Diabetes[]> {
    return this.userRepository.diabetes(id).find(filter);
  }

  @post('/users/{id}/diabetes', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diabetes)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diabetes, {
            title: 'NewDiabetesInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) diabetes: Omit<Diabetes, 'id'>,
  ): Promise<Diabetes> {
    return this.userRepository.diabetes(id).create(diabetes);
  }

  @patch('/users/{id}/diabetes', {
    responses: {
      '200': {
        description: 'User.Diabetes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diabetes, {partial: true}),
        },
      },
    })
    diabetes: Partial<Diabetes>,
    @param.query.object('where', getWhereSchemaFor(Diabetes)) where?: Where<Diabetes>,
  ): Promise<Count> {
    return this.userRepository.diabetes(id).patch(diabetes, where);
  }

  @del('/users/{id}/diabetes', {
    responses: {
      '200': {
        description: 'User.Diabetes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Diabetes)) where?: Where<Diabetes>,
  ): Promise<Count> {
    return this.userRepository.diabetes(id).delete(where);
  }
}
