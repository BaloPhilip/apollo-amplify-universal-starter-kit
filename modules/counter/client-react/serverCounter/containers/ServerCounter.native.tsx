import React from 'react';
import { Mutation, Query } from 'react-apollo';
import update from 'immutability-helper';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { ServerCounterView, ServerCounterButton } from '../components/ServerCounterView';
import { COUNTER_QUERY, ADD_COUNTER, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

interface ButtonProps {
  counterAmount: number;
  t: TranslateFunction;
  counter: any;
}

const IncreaseButton = ({ counterAmount, t, counter }: ButtonProps) => (
  <Mutation mutation={ADD_COUNTER}>
    {(mutate: any) => {
      const addServerCounter = (amount: number) => () => {
        return mutate({
          variables: {
            input: {
              amount: counter.items[0].amount + amount,
              id: counter.items[0].id
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCounter: {
              __typename: 'Counter',
              amount: counter.items[0].amount + 1,
              id: counter.items[0].id
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
      };

      const onClickHandler = () => addServerCounter(counterAmount);

      return <ServerCounterButton text={t('btnLabel')} onClick={onClickHandler()} />;
    }}
  </Mutation>
);

interface CounterProps {
  t: TranslateFunction;
  subscribeToMore: (opts: any) => any;
  loading: boolean;
  counter: any;
}

class ServerCounter extends React.Component<CounterProps> {
  private subscription: any;

  constructor(props: CounterProps) {
    super(props);
    this.subscription = null;
  }

  public componentDidMount() {
    if (!this.props.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  // remove when Renderer is overwritten
  public componentDidUpdate(prevProps: CounterProps) {
    if (!prevProps.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  public subscribeToCount() {
    this.subscription = this.props.subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (
        prev: any,
        {
          subscriptionData: {
            data: { onUpdateCounter }
          }
        }: any
      ) => {
        return update(prev, {
          listCounters: {
            items: {
              $set: [onUpdateCounter]
            }
          }
        });
      }
    });
  }

  public render() {
    const { t, counter, loading } = this.props;
    return (
      <ServerCounterView t={t} counter={counter} loading={loading}>
        <IncreaseButton t={t} counterAmount={1} counter={counter} />
      </ServerCounterView>
    );
  }
}

const ServerCounterWithQuery = (props: any) => (
  <Query query={COUNTER_QUERY}>
    {({ loading, error, data: { listCounters }, data, subscribeToMore }) => {
      if (error) {
        throw new Error(String(error));
      }
      return <ServerCounter {...props} loading={loading} subscribeToMore={subscribeToMore} counter={listCounters} />;
    }}
  </Query>
);

export default translate('serverCounter')(ServerCounterWithQuery);
