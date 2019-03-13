/* eslint-disable */
import fetch from 'isomorphic-unfetch';
/* eslint-eneble */

import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { LoggingLink } from 'apollo-logger';
import { withClientState } from 'apollo-link-state';
import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink, createLinkWithCache } from 'aws-appsync';
import aws_config from '../../../packages/client/src/aws-exports';

import log from './log';

const createApolloClient = resolvers => {
  const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const stateLink = createLinkWithCache(cache =>
    withClientState({
      cache,
      ...resolvers
    })
  );

  const appSyncLink = createAppSyncLink({
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: aws_config.aws_appsync_apiKey
    },
    region: aws_config.aws_appsync_region,
    url: aws_config.aws_appsync_graphqlEndpoint
  });

  const logger = new LoggingLink({ logger: log.debug.bind(log) });

  const link = ApolloLink.from([logger, onErrorLink, stateLink, appSyncLink]);

  return new AWSAppSyncClient({ disableOffline: true }, { link });
};

export default createApolloClient;
