<template>
  <div
    class="room p-2 m-2"
    style="min-width: 200px; box-shadow: 5px 5px 10px black"
  >
    <h4>{{ room.name }}</h4>

    <h5 v-if="players.length >= 4">FULL</h5>
    <h5 v-if="isPlaying">PLAYING...</h5>
    <div class="w-100" v-if="players.length < 4 && !isPlaying">
      <div class="text-left">Player:</div>
      <div class="text-left" v-for="(player, index) in players" :key="index">
        - {{ player }}
      </div>
    </div>
    <b-button
      v-if="players.length < 4 && !isPlaying"
      size="small"
      type="submit"
      @click.prevent="joinRoom(room.name)"
      >Join</b-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['room', 'isPlaying'],
  computed: {
    ...mapState(['socket', 'myName']),
    players () {
      return Object.keys(this.room.players).map((key) => key.split('-')[1])
    }
  },
  methods: {
    joinRoom (name) {
      let payload = {
        playerName: this.myName,
        roomName: this.room.name
      }
      this.socket.emit('join-room', payload)
    }
  }
}
</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  justify-content: start;
  background-color: white;
}
</style>
