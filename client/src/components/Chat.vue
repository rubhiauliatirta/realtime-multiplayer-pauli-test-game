<template>
  <div>
    <div>
      <h3>Live Chat</h3>
      <div style="height:300px; overflow:auto; max-width: 251px; margin: 0 auto; border-style: solid" id="chatroom">
        <table>
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(msg, index) in messages" :key="index">
              <td>
                <div v-for="(chat, index) in msg.messages" :key="index">
                  <hr>
                  <p> from: {{chat.user}} </p>
                  <p> {{chat.message}} </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <textarea v-model="message" cols="30" rows="1" placeholder="New Message"
        v-on:keyup.enter="sendMessage" v-if="isLogin"></textarea>
    </div>
    <div v-if="!isLogin">
      <h3>Input Name</h3>
      <input type="text" v-model="chatName" v-on:keyup.enter="setName">
    </div>
    <div v-if="isLogin">
      <h3>{{ chatName }}</h3>
      <button type="submit" @click.prevent="logout">change username</button>
    </div>
  </div>
</template>

<script>
  // import db from '@/fb'
  // import firebase from 'firebase'
  // import 'firebase/firestore'
  export default {
    data() {
      return {
        username: '',
        chatName: '',
        message: '',
        isLogin: false,
        messages: []
      }
    },
    methods: {
      listRoom() {
        // db
        //   .collection('chat')
        //   .get()
        //   .then(querySnapshot => {
        //     this.messages = querySnapshot.docs.map(el => {
        //       return {
        //         id: el.id,
        //         ...el.data()
        //       }
        //     })
        //   })
      },
      sendMessage() {
        // this.message = this.message.replace('\n', '')
        // db
        //   .collection('chat')
        //   .doc('livechat')
        //   .update({
        //     messages: firebase.firestore.FieldValue.arrayUnion({
        //       user: localStorage.getItem('chatName'),
        //       message: this.message
        //     })
        //   })
        //   .then(() => {
        //     this.message = ''
        //     this.listRoom()
        //   })
      },
      setName() {
        // this.chatName = localStorage.setItem('chatName', this.chatName)
        // this.isLogin = true
      },
      logout() {
        // localStorage.removeItem('chatName')
        // this.isLogin = false
      }
    },
    created() {
      // db
      //   .collection('chat')
      //   .onSnapshot(querySnapshot => {
      //     this.messages = querySnapshot.docs.map(doc => {
      //       return {
      //         id: doc.id,
      //         ...doc.data()
      //       }
      //     })
      //   })
      // if (localStorage.getItem('chatName')) {
      //   this.chatName = localStorage.getItem('chatName')
      //   this.isLogin = true
      // }
    },
    updated: function () {
      // let el = document.getElementById("chatroom");
      // el.scrollTop = el.scrollHeight;
    }
  }
</script>

<style scoped>
  html,
  body {
    width: 100%;
  }
  table {
    margin: 0 auto;
  }
</style>