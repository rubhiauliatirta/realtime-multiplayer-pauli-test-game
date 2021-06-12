<template>
  <div class="lobby py-4">
    <audio ref="audio" :src="audio" preload loop id="audio" autoplay></audio>
    <b-form action>
      <h1 style="color: #df0054; font-weight: bold">Hi, {{ myName }}</h1>
      <b-row class="my-1 justify-content-center">
        <input
          style="width: 300px"
          id="input-small"
          size="lg"
          placeholder="Room Name (minimal 4 character)"
          v-model="roomName"
          type="text"
          maxlength="12"
          minlength="4"
          autocomplete="off"
        />
        <b-button
          type="submit"
          @click.prevent="createRoom"
          :disabled="roomName.length < 4"
          >create room</b-button
        >
      </b-row>
    </b-form>
    <div class="container mt-4 w-100" style="display: flex; flex-wrap: wrap">
      <div v-if="loading" class="w-100 text-center">
        <b-spinner
          variant="danger"
          label="Spinning"
          style="width: 4rem; height: 4rem"
        ></b-spinner>
        <h1 style="color: #df0054">Getting rooms...</h1>
      </div>
      <Room
        v-for="room in roomList"
        :key="room.id"
        :room="room"
        :isPlaying="room.isPlaying"
      />
      <h1 v-if="!loading && roomList.length === 0" style="color: #df0054">
        No room available
      </h1>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { mapState } from 'vuex'
import Room from '../components/Room.vue'
import audio from '../assets/rain.mp3'

export default {
  beforeRouteEnter (to, from, next) {
    if (localStorage.getItem('playerName')) {
      next()
    } else {
      next(false)
    }
  },
  name: 'lobby',
  components: {
    Room
  },
  data () {
    return {
      roomName: '',
      roomList: [],
      audio: audio,
      loading: false
    }
  },
  computed: {
    ...mapState(['socket', 'myName'])
  },
  watch: {},
  created () {
    if (this.socket === null) {
      let socket = io(process.env.VUE_APP_SERVER)
      this.$store.commit('setSocket', socket)
    }
    this.$store.commit('resetState')
    this.listenOnSocketEvent()
    this.listRoom()
  },
  mounted () {
    this.$refs.audio.play()
  },
  methods: {
    _handleAudio () {
      this.audio.currentTime = 0
      this.audio.play()
    },
    listRoom () {
      this.socket.emit('get-rooms')
      this.loading = true
    },
    createRoom () {
      let payload = {
        name: this.roomName,
        creator: this.myName
      }
      this.socket.emit('create-room', payload)
    },
    listenOnSocketEvent () {
      this.socket.on('get-rooms', (rooms) => {
        this.roomList = rooms
        this.loading = false
      })

      this.socket.on('room-created', (room) => {
        this.roomList.push(room)
      })

      this.socket.on('show-error', (message) => {
        this.$myswal.showError(message)
      })

      this.socket.on('get-in-to-room', (room) => {
        room.isCreator && this.$store.commit('setIsCreator', true)
        this.$store.commit('setMyKey', room.playerKey)
        this.$store.commit('setRoom', room.name)
        this.$store.commit('setOtherPlayers', room.players)
        this.$store.commit('setMyScore', 0)
        this.$router.push('/play')
      })

      this.socket.on('update-client-room', () => {
        this.socket.emit('get-rooms')
      })
      this.socket.on('notify-room-playing', (roomName) => {
        alert('test')
        const playingRoom = this.roomList.find(
          (item) => item.name === roomName
        )
        if (playingRoom) {
          this.$set(playingRoom, 'isPlaying', true)
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    this.socket.off('get-rooms')
    this.socket.off('room-created')
    this.socket.off('get-in-to-room')
    this.socket.off('notify-room-playing')
    this.$refs.audio.pause()
    next()
  }
}
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
