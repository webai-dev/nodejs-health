// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import {
  post,
  requestBody,
} from '@loopback/rest';

import Twilio from 'twilio';
import { Twilio as TwilioConfig } from '../config';

const AccessToken = Twilio.jwt.AccessToken;
const { ChatGrant } = AccessToken;

import {
  authenticate
} from '@loopback/authentication';

const TwilioTokenSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: {
      type: 'string',
    },
  },
};

export class TwilioController {
  constructor() {}

  @post('/twilio/token/chat', {
    responses: {
      '200': {
        description: 'UserBaseline model instance',
        content: {'application/json': {schema: TwilioTokenSchema}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {'application/json': {
        schema: {
          type: 'object',
          properties: {
            identity: {
              type: 'string',
            }
          }
        }
      }},
    }) request: any,
  ): Promise<any> {
    const { identity } = request;
    const chatGrant = new ChatGrant({
      serviceSid: TwilioConfig.TWILIO_CHAT_SERVICE_SID
    });
    const token = new AccessToken(
      TwilioConfig.TWILIO_ACCOUNT_SID,
      TwilioConfig.TWILIO_API_KEY,
      TwilioConfig.TWILIO_API_SECRET
    );
    const anyToken: any = token;

    anyToken.addGrant(chatGrant);
    anyToken.identity = identity;

    return JSON.stringify({
      token: anyToken.toJwt()
    });
  }
}
