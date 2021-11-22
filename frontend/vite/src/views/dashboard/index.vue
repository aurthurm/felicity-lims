<template>
    <h4>Felicity Flash DashBoard</h4>
    <span v-if="fetching">Fetching users data ...</span>
    <span v-else-if="error">Error: {{ error }}</span>
    <ul v-else>
      <li v-for="user in data.userAll.edges" :key="user.id">{{ user.node.firstName }}</li>
    </ul> 

  <hr class="mt-4 mb-2">
  <div class="flex justify-between mb-2">
    <button @click="doSuccess" type="button" class="btn btn-success">Success</button>
    <button @click="doError" type="button" class="btn btn-danger">Error</button>
    <button @click="doWarning" type="button" class="btn btn-warning">Warning</button>
    <button @click="doInfo" type="button" class="btn btn-info">Info</button>
    <button @click="doQuestion" type="button" class="btn btn-primary">QUESTION?</button>
  </div>
  <hr>
  <section>
    <h1>WebSocket Chat</h1>
        <form action="" >
            <label>Item ID: <input type="text" id="itemId" autocomplete="off" value="foo"/></label>
            <label>Token: <input type="text" id="token" autocomplete="off" value="some-key-token"/></label>
            <button  @click.prevent="connect()">Connect</button>
            <hr>
            <label>Message: <input type="text" id="messageText" autocomplete="off"/></label>
            <button @click.prevent="sendMessage()">Send</button>
        </form>
        <ul id='messages'>
        </ul>
  </section>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuery } from '@urql/vue';
import { useStore} from "vuex";
import { GET_ALL_USERS } from '../../graphql/_queries'
import { ActionTypes } from '../../store/modules/toast'
export default defineComponent({
  name: "DashBoard",
  setup() {
    let store = useStore();

    const { data, fetching, error } = useQuery({
      query: GET_ALL_USERS,
    })

    if (error) {
      store.dispatch(ActionTypes.NOTIFY_ERROR, error)
    }

    function doSuccess() {
      store.dispatch(ActionTypes.ALERT_SUCCESS, "yi doSuccess le")
    }

    function doError() { 
      store.dispatch(ActionTypes.ALERT_ERROR, "yi doError le")
    }

    function doWarning() {
      store.dispatch(ActionTypes.ALERT_WARING, "yi doWarning le")
    }

    function doInfo() {
      store.dispatch(ActionTypes.ALERT_INFO, "yi doInfo le")
    }

    function doQuestion() {
      store.dispatch(ActionTypes.ALERT_QUESTION, "yi doQuestion le")
    }

    // function



    let ws = ref(null);

    function connect() {
        var itemId = document.getElementById("itemId")
        var token = document.getElementById("token")
        ws = new WebSocket("ws://localhost:8000/ws");
        ws.onmessage = function(event: any) {
            var messages = document.getElementById('messages')
            var message = document.createElement('li')
            var content = document.createTextNode(event.data)
            message.appendChild(content)
            messages.appendChild(message)
        };
    }

    function sendMessage() {
        var input = document.getElementById("messageText")
        ws.send(input.value)
        input.value = ''
    }


    //
    return { 
      data, 
      fetching, 
      error,
      doSuccess,
      doError,
      doWarning,
      doInfo,
      doQuestion,
      ws,
      connect,
      sendMessage
    };
  },
});
</script>