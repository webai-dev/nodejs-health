import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PasswordResetRequest,
  User,
} from '../models';
import {PasswordResetRequestRepository} from '../repositories';

export class PasswordResetRequestUserController {
  constructor(
    @repository(PasswordResetRequestRepository)
    public passwordResetRequestRepository: PasswordResetRequestRepository,
  ) { }

  @get('/password-reset-requests/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to PasswordResetRequest',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof PasswordResetRequest.prototype.id,
  ): Promise<User> {
    return this.passwordResetRequestRepository.user(id);
  }
}
