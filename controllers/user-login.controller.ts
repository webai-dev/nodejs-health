import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {UserLogin} from '../models';
import {UserLoginRepository} from '../repositories';

export class UserLoginController {
  constructor(
    @repository(UserLoginRepository)
    public userLoginRepository : UserLoginRepository,
  ) {}

  @post('/user-logins', {
    responses: {
      '200': {
        description: 'UserLogin model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserLogin)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {
            title: 'NewUserLogin',
            exclude: ['id'],
          }),
        },
      },
    })
    userLogin: Omit<UserLogin, 'id'>,
  ): Promise<UserLogin> {
    return this.userLoginRepository.create(userLogin);
  }

  @get('/user-logins/count', {
    responses: {
      '200': {
        description: 'UserLogin model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserLogin) where?: Where<UserLogin>,
  ): Promise<Count> {
    return this.userLoginRepository.count(where);
  }

  @get('/user-logins', {
    responses: {
      '200': {
        description: 'Array of UserLogin model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserLogin, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserLogin) filter?: Filter<UserLogin>,
  ): Promise<UserLogin[]> {
    return this.userLoginRepository.find(filter);
  }

  @patch('/user-logins', {
    responses: {
      '200': {
        description: 'UserLogin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {partial: true}),
        },
      },
    })
    userLogin: UserLogin,
    @param.where(UserLogin) where?: Where<UserLogin>,
  ): Promise<Count> {
    return this.userLoginRepository.updateAll(userLogin, where);
  }

  @get('/user-logins/{id}', {
    responses: {
      '200': {
        description: 'UserLogin model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserLogin, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserLogin, {exclude: 'where'}) filter?: FilterExcludingWhere<UserLogin>
  ): Promise<UserLogin> {
    return this.userLoginRepository.findById(id, filter);
  }

  @patch('/user-logins/{id}', {
    responses: {
      '204': {
        description: 'UserLogin PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {partial: true}),
        },
      },
    })
    userLogin: UserLogin,
  ): Promise<void> {
    await this.userLoginRepository.updateById(id, userLogin);
  }

  @put('/user-logins/{id}', {
    responses: {
      '204': {
        description: 'UserLogin PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userLogin: UserLogin,
  ): Promise<void> {
    await this.userLoginRepository.replaceById(id, userLogin);
  }

  @del('/user-logins/{id}', {
    responses: {
      '204': {
        description: 'UserLogin DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userLoginRepository.deleteById(id);
  }
}
