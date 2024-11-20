import { urqlClient } from '@/urql';
import { TypedDocumentNode } from '@urql/core';
import { AnyVariables } from '@urql/core';
import { ref } from 'vue';
import { RequestPolicy } from '@urql/vue';
import useNotifyToast from './alert_toast';

const { toastInfo, toastError, swalError } = useNotifyToast();

const errors = ref<any[]>([]);
const messages = ref<any[]>([]);

export default function useApiUtil() {
    // Automatic Error handling from Graphql backend
    const gqlErrorHandler = (error: any) => {
        if (typeof error == 'object') {
            if (error.graphQLErrors) {
                const gErrors = new Set();
                error.graphQLErrors?.forEach((err: any) => gErrors.add(err.message));
                gErrors?.forEach((err: any) => toastError(err));
            }
            if (error.networkError) {
                toastError(error.networkError.message);
                swalError('!!OOPS!!: Something just hapenned Please login again :)');
            }
        }
    };

    const gqlResponseHandler = (res: any): any => {
        if (res?.error) {
            errors.value.unshift(res.error);
            gqlErrorHandler(res.error);
        }
        return res?.data ?? {};
    };

    const gqlOpertionalErrorHandler = (payload: any, key: string): any => {
        if (payload.hasOwnProperty(key)) {
            const res = payload[key];
            if(res?.__typename) {
                if (res?.__typename === 'OperationError') {
                    errors.value.unshift(res);
                    swalError(res.error + '\n' + res.suggestion);
                    return;
                } else if (["MessagesType", "OperationSuccess"].includes(res?.__typename)){
                    messages.value.unshift(res);
                    toastInfo(res.message)
                } else {
                    //
                }
            } else {
                // instread of this which is not good. maybe create some dots status bar that appear green for success and red for error
            }
        }
        return payload;
    };

    const GQLResponseInterceptor = (res: any, key: string): any => {
        return gqlOpertionalErrorHandler(gqlResponseHandler(res), key);
    };

    async function withClientQuery<TData, TVariables extends AnyVariables>(
        query: TypedDocumentNode<TData, TVariables>, 
        variables: TVariables, 
        dataKey?: keyof TData, 
        requestPolicy: RequestPolicy = 'cache-first'
      ): Promise<TData[keyof TData]> {
        return await urqlClient
          .query(query, variables, { requestPolicy })
          .toPromise()
          .then(result => {
            const data = GQLResponseInterceptor(result, dataKey as string);
            return dataKey ? data[dataKey] : data;
          });
      }
    
      async function withClientMutation<TData, TVariables extends AnyVariables>(
        mutation: TypedDocumentNode<TData, TVariables>, 
        variables: TVariables, 
        dataKey?: keyof TData
      ): Promise<TData[keyof TData]> {
        return await urqlClient
          .mutation(mutation, variables)
          .toPromise()
          .then(result => {
            const data = GQLResponseInterceptor(result, dataKey as string);
            return dataKey ? data[dataKey] : data;
          });
      }

    async function withClientOperation(operationType, query, variables, dataKey, requestPolicy: RequestPolicy = 'cache-first'): Promise<any> {
        const operation = operationType === 'mutation' ? urqlClient.mutation(query, variables) : urqlClient.query(query, variables, { requestPolicy });
        return await operation
            .toPromise()
            .then(result => {
                const data = GQLResponseInterceptor(result, dataKey);
                return dataKey ? data[dataKey] : data;
            });
        }

    // --
    return {
        gqlResponseHandler,
        gqlErrorHandler,
        gqlOpertionalErrorHandler,
        GQLResponseInterceptor,
        withClientMutation,
        withClientQuery,
        withClientOperation,
        errors,
    };
}
