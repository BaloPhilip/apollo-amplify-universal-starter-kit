import React, { useEffect } from 'react';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

interface ButtonProps {
  t: TranslateFunction;
  counter: any;
}

const IncreaseButton = ({ t, counter: { items } }: ButtonProps) => {
  const { amount, id } = items[0];
  return (
    <Mutation mutation={ADD_COUNTER}>
      {(mutate: any) => {
        const addServerCounter = () =>
          mutate({
            variables: {
              input: {
                amount: amount + 1,
                id
              }
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateCounter: {
                __typename: 'Counter',
                amount: amount + 1,
                id
              }
            },
            update: (cache: any, { data }: any) => {
              const newData = data.updateCounter;

              cache.writeQuery({
                query: COUNTER_QUERY,
                data: {
                  listCounters: {
                    items: [newData],
                    __typename: 'ModelCounterConnection'
                  }
                }
              });
            }
          });

        return <ServerCounterButton text={t('btnLabel')} onClick={addServerCounter} />;
      }}
    </Mutation>
  );
};

const subscribeToCount = (subscribeToMore: any): any =>
  subscribeToMore({
    document: COUNTER_SUBSCRIPTION,
    variables: {},
    updateQuery: (
      prev: any,
      {
        subscriptionData: {
          data: { onUpdateCounter }
        }
      }: any
    ) =>
      update(prev, {
        listCounters: {
          items: {
            $set: [onUpdateCounter]
          }
        }
      })
  });

interface CounterProps {
  t: TranslateFunction;
  subscribeToMore: (opts: any) => any;
  loading: boolean;
  counter: any;
}

const ServerCounter = ({ t, counter, loading, subscribeToMore }: CounterProps) => {
  useEffect(() => {
    const subscribe = subscribeToCount(subscribeToMore);
    return () => subscribe();
  });

  return (
    <ServerCounterView t={t} counter={counter} loading={loading}>
      <IncreaseButton t={t} counter={counter} />
    </ServerCounterView>
  );
};

const ServerCounterWithQuery = (props: any) => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data: { listCounters }, subscribeToMore }) => {
      if (error) {
        throw new Error(String(error));
      }
      return <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={listCounters} />;
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
