/* eslint-disable */

import fetch from 'isomorphic-unfetch';
/* eslint-eneble */

import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import aws_config from '../../../packages/client/src/aws-exports';

const client = new AWSAppSyncClient({
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: aws_config.aws_appsync_apiKey
  },
  region: aws_config.aws_appsync_region,
  url: aws_config.aws_appsync_graphqlEndpoint,
  disableOffline: true
});

export default client;
