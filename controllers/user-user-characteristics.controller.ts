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
  UserCharacteristics,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserCharacteristicsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-characteristics', {
    responses: {
      '200': {
        description: 'User has one UserCharacteristics',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCharacteristics),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserCharacteristics>,
  ): Promise<UserCharacteristics> {
    return this.userRepository.userCharacteristics(id).get(filter);
  }

  @post('/users/{id}/user-characteristics', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCharacteristics)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCharacteristics, {
            title: 'NewUserCharacteristicsInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userCharacteristics: Omit<UserCharacteristics, 'id'>,
  ): Promise<UserCharacteristics> {
    return this.userRepository.userCharacteristics(id).create(userCharacteristics);
  }

  @patch('/users/{id}/user-characteristics', {
    responses: {
      '200': {
        description: 'User.UserCharacteristics PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCharacteristics, {partial: true}),
        },
      },
    })
    userCharacteristics: Partial<UserCharacteristics>,
    @param.query.object('where', getWhereSchemaFor(UserCharacteristics)) where?: Where<UserCharacteristics>,
  ): Promise<Count> {
    return this.userRepository.userCharacteristics(id).patch(userCharacteristics, where);
  }

  @del('/users/{id}/user-characteristics', {
    responses: {
      '200': {
        description: 'User.UserCharacteristics DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserCharacteristics)) where?: Where<UserCharacteristics>,
  ): Promise<Count> {
    return this.userRepository.userCharacteristics(id).delete(where);
  }
}
