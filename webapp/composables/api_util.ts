import { urqlClient } from '../urql';
import { ref } from 'vue'
import { RequestPolicy } from '@urql/vue';
import useNotifyToast from './alert_toast'

const { 
  toastSuccess, toastInfo, toastWarning, toastError,
  swalSuccess, swalInfo, swalWarning, swalError 
} = useNotifyToast()


const errors = ref<any[]>([]);


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
      if(res.error) {
        errors.value.unshift(res.error)
        gqlErrorHandler(res.error);
      }
      return res.data;
    }

    const gqlOpertionalErrorHandler = (payload: any, key: string):any => {
      if(payload.hasOwnProperty(key)) {
        const res = payload[key]
        if(res?.__typename && res?.__typename === 'OperationError') {
          errors.value.unshift(res)
          console.log("swalError")
          swalError(res.error + "\n" + res.suggestion);
          return;
        } else {
          // toastInfo("operation success");
          // instread of this which is not good. maybe create some dots status bar that appear green for success and red for error
        };
      }
      return payload;
    }

    const GQLResponseInterceptor = (res: any,key: string): any => {
      return gqlOpertionalErrorHandler(gqlResponseHandler(res), key)
    }

    async function withClientMutation(query, payload, dataKey): Promise<any> {
      return await urqlClient
      .mutation(query, payload)
      .toPromise()
      .then(result => {
        const data = GQLResponseInterceptor(result, dataKey)
        if(dataKey){
          return data[dataKey]
        } else {
          return data
        }
      })
    }

    async function withClientQuery(query, variables, dataKey, requestPolicy: RequestPolicy = 'cache-first'): Promise<any> { // cache-and-network
      return await urqlClient
      .query(query, variables, { requestPolicy })
      .toPromise()
      .then(result => {
        const data = GQLResponseInterceptor(result, dataKey)
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
        withClientMutation, withClientQuery
    }
}





