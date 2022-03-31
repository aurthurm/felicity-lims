import { urqlClient } from '../urql';
import { useMutation, useQuery, RequestPolicy } from '@urql/vue';
import { ref } from 'vue';
import useNotifyToast from './alert_toast'

const { 
  toastSuccess, toastInfo, toastWarning, toastError,
  swalSuccess, swalInfo, swalWarning, swalError 
} = useNotifyToast()


export default function useApiUtil(){

    // Automatic Error handling from Graphql backend
    const gqlErrorHandler = (error: any) => {
      if(typeof(error) == 'object'){
        if(error.graphQLErrors) {
          const gErrors = new Set()
          error.graphQLErrors?.forEach((err :any) => gErrors.add(err.message))
          gErrors?.forEach((err :any) => toastError(err))
        }
        if(error.networkError) {
          toastError(error.networkError.message);
          swalError("!!OOPS!!: Something just hapenned Please login again :)")
        }
      }
    }

    const gqlResponseHandler = (res: any):any => {
      if(res.error) gqlErrorHandler(res.error);
      return res.data;
    }

    const gqlOpertionalErrorHandler = (res: any):any => {
      if(res.__typename === 'OperationError') {
        swalError(res.error + "\n" + res.suggestion);
        return;
      };
      return res;
    }

    const GQLResponseInterceptor = (res: any): any => {
      return gqlOpertionalErrorHandler(gqlResponseHandler(res))
    }

    async function withUseMutation(query, payload, dataKey): Promise<any> {
      const { executeMutation: mutator } = useMutation(query)
      await mutator(payload).then(result => {
        const data = gqlResponseHandler(result)
        if(dataKey){
          return data[dataKey]
        } else {
          return data
        }
      });
    }

    async function withUseQuery(query, variables, dataKey, requestPolicy: RequestPolicy = 'cache-and-network'): Promise<any> {
      return await useQuery({ query, variables, requestPolicy })
      .then(payload =>  {
        const data = GQLResponseInterceptor(payload)
        if(dataKey){
          return data.value[dataKey]
        } else {
          return data.value
        }
      })
    }

    async function withClientQuery(query, variables, dataKey, requestPolicy: RequestPolicy = 'cache-and-network'): Promise<any> {
      return await urqlClient
      .query(query, variables, { requestPolicy })
      .toPromise()
      .then(result => {
        const data = GQLResponseInterceptor(result)
        if(dataKey){
          return data[dataKey]
        } else {
          return data
        }
      })
    }

    // -- 
    return { 
        gqlResponseHandler, gqlErrorHandler, gqlOpertionalErrorHandler,
        GQLResponseInterceptor, 
        withUseMutation, withClientQuery, withUseQuery
    }
}





