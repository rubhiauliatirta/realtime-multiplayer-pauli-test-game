<template>
  <div class="lobby py-4">
    <b-form action>
      <h1 style="color: #df0054; font-weight:bold">Hi, {{myName}}</h1>
      <b-row class="my-1 justify-content-center">
        <input
          id="input-small"
          size="sm"
          placeholder="Room Name"
          v-model="roomName"
          type="text"
          maxlength="12"
          minlength="4"
          autocomplete="off"
        >
        <b-button type="submit" @click.prevent="createRoom">create room</b-button>
      </b-row>
    </b-form>
    <div class="container mt-4 w-100" style="display: flex; flex-wrap: wrap;">
      <Room
        v-for="(room) in roomList" :key="room.id"
        :room="room"/>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import db from "@/fb";
import io from 'socket.io-client'
import {mapState, mapMutations} from 'vuex'
import Room from '../components/Room.vue'
export default {
  beforeRouteEnter (to, from, next) {
   if(localStorage.getItem("playerName")){
     next()
   }else {
     next(false)
   }
  },
  name: "lobby",
  components : {
    Room
  },
  data() {
    return {
      roomName: "",
      roomList: [],
      audio : null
    };
  },
  computed : {
    ...mapState(["socket", "myName"])
  },
  watch: {},
  created() {
     this.audio = new Audio('https://s3.amazonaws.com/freesoundeffects/mp3/mp3_428294.mp3');
      this.audio.addEventListener('ended', this._handleAudio, false);
      this.audio.play();
    if(this.socket === null){
      //let socket = io("http://localhost:3000")
      let socket = io("https://murmuring-wildwood-15232.herokuapp.com/")
      this.$store.commit('setSocket',socket)
    }
    this.$store.commit('resetState')
    this.listenOnSocketEvent()
    this.listRoom();
  },
  mounted() {},
  methods: {
    _handleAudio(){
      this.currentTime = 0;
      this.play();
    },
    listRoom() {
      this.socket.emit('get-rooms')
    },
    createRoom() {
      let payload = {
        name : this.roomName,
        creator : this.myName
      }
      this.socket.emit('create-room', payload)
    },
    listenOnSocketEvent(){
      this.socket.on('get-rooms', (rooms) => {
        console.log(rooms)
        this.roomList = rooms
      })

      this.socket.on('room-created', (room) => {
        this.roomList.push(room)
        
      })

      this.socket.on('get-in-to-room', (room) => {
        console.log(room.playerKey)
        room.isCreator && this.$store.commit("setIsCreator", true)
        this.$store.commit("setMyKey", room.playerKey)
        this.$store.commit("setRoom", room.name) 
        this.$store.commit("setOtherPlayers", room.players)
        this.$store.commit("setMyScore", 0)
        this.$router.push('/play') 
      })

      this.socket.on('update-client-room', ()=>{
        this.socket.emit('get-rooms')
      })
    }
  },
  destoyed(){
    this.socket.off('get-rooms')
    this.socket.off('room-created')
    this.socket.off('get-in-to-room')
    this.audio.pause()
  }
};
</script>

<style scoped>
.lobby {
  background: url("https://images.unsplash.com/photo-1474926136673-20f4d627b833?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Pacifico", cursive;
  font-family: "Special Elite", cursive;
}

.lets-play {
  width: 300px;
  font-size: 40px;
}

h3 {
  font-size: 40px;
  color: #df0054;
}
</style>
