import { createClient, defaultExchanges, dedupExchange, cacheExchange, fetchExchange, errorExchange, subscriptionExchange } from 'urql';
import { makeOperation } from '@urql/core';
import { devtoolsExchange } from '@urql/devtools'
import { authExchange } from '@urql/exchange-auth';

import { graphql_url, graphql_ws_url } from './conf'

import { createClient as createWSClient } from 'graphql-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws'

const subscriptionClient = new SubscriptionClient( graphql_ws_url, { reconnect: true });

const wsClient = createWSClient({
  url: graphql_ws_url,
});

// 1. get auth data
const getAuth = async ({ authState }) => {

  if (!authState) {
    const token = localStorage.getItem('fwt');
    if (token) {
      return { token };
    }
    return null;
  }

  if(authState.token) {
    return { token: authState.token };
  }

  logout();

  return null;
};

// 2. add auth to all requests
const addAuthToOperation = ({ authState, operation }) => {
  if (!authState || !authState.token) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation?.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.token}`,
      },
      credentials: 'include',
    },
  });
};


const didAuthError = (error: any ) => {
  if(!error.graphQLErrors|| error.graphQLErrors.length ===0){
    return error.message == "[Network] Failed to fetch"
  }
  return error.graphQLErrors.some((e: any) => e.extensions?.code === 'FORBIDDEN');
};

const logout = () => {
  localStorage.removeItem("fwt");
  localStorage.removeItem("fuser");
  localStorage.removeItem("fuid");
  localStorage.removeItem("fRole");
  location.reload();
}

const willAuthError = (authState: any) => {
  if (!authState || "/* JWT is expired */") return true;
  return false;
}

// https://github.com/FormidableLabs/urql/tree/main/exchanges/auth#quick-start-guide
export const urqlClient = createClient({
  url: graphql_url,
   ...(('process.env.DEV') && { exchanges: [devtoolsExchange, ...defaultExchanges] }),
  exchanges: [
    dedupExchange,
    cacheExchange,
    errorExchange({
      onError: error => {
        let isAuthError = false;
        if(!error.graphQLErrors || error.graphQLErrors.length ===0){
          isAuthError = error.message === "[Network] Failed to fetch";
        }else{
          isAuthError = error.graphQLErrors.some(e => e.extensions?.code === 'FORBIDDEN');
        }
        if (isAuthError) {
          logout();
        }
      },
    }),
    authExchange({
      addAuthToOperation,
      willAuthError,
      didAuthError,
      getAuth,
    }),
    fetchExchange,
    subscriptionExchange({
      // forwardSubscription: (operation) => ({
      //   subscribe: (sink: any) => ({
      //     unsubscribe: wsClient.subscribe(operation, sink),
      //   }),
      // }),
      forwardSubscription: operation => subscriptionClient.request(operation) as any
    }),
  ],  
  fetchOptions: () => {
    const token = localStorage.getItem('fwt');
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        ...(token && {
          'x-felicity-user-id': "felicity-user",
          'x-felicity-role': "felicity-administrator",
          'Authorization': `Bearer ${token}`
        }),
      },
    };
  },
});
