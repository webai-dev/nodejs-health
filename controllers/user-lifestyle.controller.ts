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
  Lifestyle,
} from '../models';
import {UserRepository} from '../repositories';

export class UserLifestyleController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/lifestyles', {
    responses: {
      '200': {
        description: 'Array of User has many Lifestyle',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Lifestyle)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Lifestyle>,
  ): Promise<Lifestyle[]> {
    return this.userRepository.lifestyles(id).find(filter);
  }

  @post('/users/{id}/lifestyles', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Lifestyle)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lifestyle, {
            title: 'NewLifestyleInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) lifestyle: Omit<Lifestyle, 'id'>,
  ): Promise<Lifestyle> {
    return this.userRepository.lifestyles(id).create(lifestyle);
  }

  @patch('/users/{id}/lifestyles', {
    responses: {
      '200': {
        description: 'User.Lifestyle PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lifestyle, {partial: true}),
        },
      },
    })
    lifestyle: Partial<Lifestyle>,
    @param.query.object('where', getWhereSchemaFor(Lifestyle)) where?: Where<Lifestyle>,
  ): Promise<Count> {
    return this.userRepository.lifestyles(id).patch(lifestyle, where);
  }

  @del('/users/{id}/lifestyles', {
    responses: {
      '200': {
        description: 'User.Lifestyle DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Lifestyle)) where?: Where<Lifestyle>,
  ): Promise<Count> {
    return this.userRepository.lifestyles(id).delete(where);
  }
}
