<template>
  <div class="home" >
    <b-form @submit.prevent="startGame">
      <b-form-input
        class="mb-5"
        id="input-small"
        size="sm"
        placeholder="Enter your name to join the game"
        v-model="playerName"
        autocomplete="off"
      ></b-form-input>
      <b-button
        type="submit"
        :disabled="playerName === ''"
        class="lets-play animated infinite bounce delay-2s"
        @click.prevent="startGame"
        variant="outline-danger"
      >Let's Play</b-button>
    </b-form>
  </div>
</template>

<script>
// @ is an alias to /src
//import db from "@/fb";
import io from 'socket.io-client'
import {mapState, mapMutations} from 'vuex'
export default {
  name: "home",
  data() {
    return {
      playerName: "",
    };
  },
  computed : {
    ...mapState(["socket", "myName"])
  },
  watch: {},
  created() {
    let audio = new Audio('https://s3.amazonaws.com/freesoundeffects/mp3/mp3_428294.mp3');
    audio.play();
  },
  mounted() {},
  methods: {
    ...mapMutations(['setSocket', 'setMyName']),
    startGame() {
       this.setMyName(this.playerName)
       if(this.socket === null){
         let socket = io(process.env.VUE_APP_SERVER)
         //let socket = io("https://murmuring-wildwood-15232.herokuapp.com/")
         //let socket = io("https://guarded-harbor-22113.herokuapp.com/")
         //let socket = io("http://localhost:3000")
         this.setSocket(socket)
       }
       localStorage.setItem("playerName", this.playerName)
       this.$router.push("/lobby")
    },
  }

};
</script>

<style scoped>
.home {
  background: url("https://images.unsplash.com/photo-1474926136673-20f4d627b833?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
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
