import {
    createClient,
    dedupExchange,
    cacheExchange,
    fetchExchange,
    errorExchange,
    CombinedError,
    Operation,
    Exchange,
} from 'urql';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { pipe, tap } from 'wonka';

import { getAuthData, authLogout } from './auth';
import { GQL_BASE_URL } from './conf';
import { useNotifyToast } from './composables';
import jwtDecode from 'jwt-decode';

const { toastError } = useNotifyToast();

const getAuth = async ({ authState }) => {
    const authData = getAuthData();

    if (!authState) {
        if (authData?.auth?.token) {
            return { token: authData?.auth?.token };
        }
        return null;
    }

    if (authState.token) {
        return { token: authState.token };
    }

    toastError('Faied to get Auth Data. Login');

    authLogout();

    return null;
};

const addAuthToOperation = ({ authState, operation }) => {
    if (!authState || !authState.token) {
        return operation;
    }

    const fetchOptions =
        typeof operation.context.fetchOptions === 'function' ? operation.context.fetchOptions() : operation.context.fetchOptions || {};

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

const didAuthError = (error: any) => {
    if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
        return error.message == '[Network] Failed to fetch';
    }
    return error.graphQLErrors.some((e: any) => e.extensions?.code === 'FORBIDDEN');
};

const willAuthError = (authState: any) => {
    if (!authState) return true;

    try {
        const decodedToken: any = jwtDecode(authState.token);
        const currentTime = new Date().getTime() / 1000;
        if (decodedToken.exp < currentTime) {
            // JWT is expired
            return true;
        }
    } catch (error) {
        return true;
    }

    return false;
};

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
        dedupExchange,
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
        authExchange({
            addAuthToOperation,
            willAuthError,
            didAuthError,
            getAuth,
        }),
        resultInterceptorExchange,
        fetchExchange,
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
