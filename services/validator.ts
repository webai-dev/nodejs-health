import {HttpErrors} from '@loopback/rest';
import isemail from 'isemail';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (credentials.email && !isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}
