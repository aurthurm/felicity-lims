import {
    createClient,
    cacheExchange,
    fetchExchange,
    errorExchange,
    subscriptionExchange,
    CombinedError,
    Operation,
    Exchange,
} from '@urql/vue';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { pipe, tap } from 'wonka';

import { getAuthData, authLogout } from '@/auth';
import { GQL_BASE_URL, WS_BASE_URL } from '@/conf';
import useNotifyToast from '@/composables/alert_toast';

const { toastError } = useNotifyToast();

const subscriptionClient = new SubscriptionClient(WS_BASE_URL, {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
        const authData = getAuthData();
        return {
            headers: {
                ...(authData?.auth?.token && {
                    'x-felicity-user-id': 'felicity-user-x',
                    'x-felicity-role': 'felicity-role-x',
                    Authorization: `Bearer ${authData?.auth?.token}`,
                }),
            },
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
            onError: (error: CombinedError, operation: Operation) => {
                let isAuthError = false;

                if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
                    isAuthError = error.message === '[Network] Failed to fetch';
                } else {
                    isAuthError = error.graphQLErrors.some(e => e.extensions?.code === 'FORBIDDEN');
                }
                if (isAuthError) {
                    toastError('Unknown Network Error Encountered');
                    authLogout();
                }
            },
        }),
        resultInterceptorExchange,
        fetchExchange,
        subscriptionExchange({
            forwardSubscription: operation => subscriptionClient.request(operation) as any,
        }),
    ],
    fetchOptions: () => {
        const authData = getAuthData();
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                ...(authData?.auth?.token && {
                    Authorization: `Bearer ${authData?.auth?.token}`,
                }),
            },
        };
    },
});
