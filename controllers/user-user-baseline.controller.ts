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
  UserBaseline,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserBaselineController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-baseline', {
    responses: {
      '200': {
        description: 'User has one UserBaseline',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserBaseline),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserBaseline>,
  ): Promise<UserBaseline> {
    return this.userRepository.userBaseline(id).get(filter);
  }

  @post('/users/{id}/user-baseline', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserBaseline)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBaseline, {
            title: 'NewUserBaselineInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userBaseline: Omit<UserBaseline, 'id'>,
  ): Promise<UserBaseline> {
    return this.userRepository.userBaseline(id).create(userBaseline);
  }

  @patch('/users/{id}/user-baseline', {
    responses: {
      '200': {
        description: 'User.UserBaseline PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBaseline, {partial: true}),
        },
      },
    })
    userBaseline: Partial<UserBaseline>,
    @param.query.object('where', getWhereSchemaFor(UserBaseline)) where?: Where<UserBaseline>,
  ): Promise<Count> {
    return this.userRepository.userBaseline(id).patch(userBaseline, where);
  }

  @del('/users/{id}/user-baseline', {
    responses: {
      '200': {
        description: 'User.UserBaseline DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserBaseline)) where?: Where<UserBaseline>,
  ): Promise<Count> {
    return this.userRepository.userBaseline(id).delete(where);
  }
}
