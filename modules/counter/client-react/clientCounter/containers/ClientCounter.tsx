import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { ClientCounterButton, ClientCounterView } from '../components/ClientCounterView';
import { COUNTER_QUERY_CLIENT, ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

interface ButtonProps {
  t: TranslateFunction;
}

const IncreaseButton = ({ t }: ButtonProps): any => (
  <Mutation mutation={ADD_COUNTER_CLIENT}>
    {mutate => {
      const addClientCounter = () => {
        const { value }: any = mutate();
        return value;
      };
      return <ClientCounterButton text={t('btnLabel')} onClick={addClientCounter} />;
    }}
  </Mutation>
);

interface CounterProps {
  t: TranslateFunction;
}

const ClientCounter = ({ t }: CounterProps) => (
  <Query query={COUNTER_QUERY_CLIENT}>
    {({ data }) => {
      return (
        <ClientCounterView text={t('text', { amount: data.clientCounter ? data.clientCounter.amount : 1 })}>
          <IncreaseButton t={t} />
        </ClientCounterView>
      );
    }}
  </Query>
);

export default translate('clientCounter')(ClientCounter);
