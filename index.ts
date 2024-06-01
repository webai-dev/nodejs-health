import {DialivApiApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import cors from 'cors';

require('dotenv').config();

export {DialivApiApplication};

export async function main(options: ApplicationConfig = {}) {
  options = Object.assign({}, { rest: { openApiSpec: { servers: [{ url: 'http://localhost:3000' }] } } });

  const OASGraph = require('openapi-to-graphql');
  const express = require('express');
  const graphqlHTTP = require('express-graphql');

  const app = new DialivApiApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url} Bingo!`);
  console.log(`Try ${url}/ping`);

  const oas = await app.restServer.getApiSpec();
  try {
    const myExpress = express();
    const { schema } = await OASGraph.createGraphQLSchema(oas, {
      viewer: false,
      operationIdFieldNames: true,
      idFormats: ['GraphQLID'],
      tokenJSONpath: '$.jwt',
    });

    myExpress.use(cors());
    myExpress.use(function (req: any, res: any, next: any) {
      if (req.headers && req.headers.authorization) {
          req.jwt = req.headers.authorization.replace(/^Bearer /, '');
      }
      next();
    });
    myExpress.use('/graphql', graphqlHTTP(async (req: any) => {
      return {
        schema,
        graphiql: true
      }
    }));
    myExpress.listen(3001, () => {
      console.log('OASGraph ready at http://localhost:3001/graphql');
    });
  } catch (err) {
    console.log('Error: ', err.message);
  }

  return app;
}
