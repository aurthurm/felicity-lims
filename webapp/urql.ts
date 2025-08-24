import {
    createClient,
    cacheExchange,
    fetchExchange,
    errorExchange,
    subscriptionExchange,
    Exchange,
} from '@urql/vue';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createClient as createWSClient, SubscribePayload } from 'graphql-ws';
import { pipe, tap } from 'wonka';

import { getAuthData, authLogout, generateRequestId } from '@/auth';
import { GQL_BASE_URL, WS_BASE_URL } from '@/conf';
import useNotifyToast from '@/composables/alert_toast';

const { toastError } = useNotifyToast();

const subscriptionClient = new SubscriptionClient(WS_BASE_URL, {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
        const authData = getAuthData();
        console.log('WebSocket connectionParams called with token:', authData?.token ? 'present' : 'missing');
        return {
            'X-Request-ID': generateRequestId(),
            ...(authData?.token && {
                Authorization: `Bearer ${authData?.token}`,
            }),
            ...(authData?.activeLaboratory && {
                'X-Laboratory-ID': authData?.activeLaboratory?.uid,
            }),
        };
    },
});

const wsClient = createWSClient({
    url: WS_BASE_URL,
    connectionParams: () => {
        const authData = getAuthData();
        console.log('WebSocket connectionParams called with token:', authData?.token ? 'present' : 'missing');
        return {
            'X-Request-ID': generateRequestId(),
            ...(authData?.token && {
                Authorization: `Bearer ${authData?.token}`,
            }),
            ...(authData?.activeLaboratory && {
                'X-Laboratory-ID': authData?.activeLaboratory?.uid,
            }),
        };
    },
});

const resultInterceptorExchange: Exchange =
    ({ forward }) =>
    ops$ =>
        pipe(
            ops$,
            forward,
            tap(operationResult => {})
        );

export const urqlClient = createClient({
    url: GQL_BASE_URL,
    exchanges: [
        cacheExchange,
        errorExchange({
            onError: (error, operation) => {
                const { graphQLErrors, networkError } = error;
              
                if (graphQLErrors?.length) {
                  for (const err of graphQLErrors) {
                    switch (err.extensions?.code) {
                      case 'FORBIDDEN':
                      case 'UNAUTHENTICATED':
                        toastError('Session expired, logging out...');
                        authLogout();
                        break;
                      case 'BAD_USER_INPUT':
                        toastError(err.message);
                        break;
                      default:
                        toastError('Server error: ' + err.message);
                    }
                  }
                }
              
                if (networkError) {
                  toastError('Network error: ' + networkError.message);
                }
            }
        }),
        resultInterceptorExchange,
        fetchExchange,
        // subscriptionExchange({
        //     forwardSubscription: request => subscriptionClient.request(request) as any,
        // }),
        subscriptionExchange({
            forwardSubscription(operation) {
              return {
                subscribe: (sink) => {
                  const dispose = wsClient.subscribe(
                    operation as SubscribePayload, 
                    sink,
                  );
                  return {
                    unsubscribe: dispose,
                  };
                },
              };
            },
          }),
    ],
    fetchOptions: () => {
        const authData = getAuthData();
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                'X-Request-ID': generateRequestId(),
                ...(authData?.token && {
                    Authorization: `Bearer ${authData?.token}`,
                }),
                ...(authData?.activeLaboratory && {
                    'X-Laboratory-ID': authData?.activeLaboratory?.uid,
                }),
            },
        };
    },
});
