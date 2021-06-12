<template>
  <b-container>
    <b-row v-if="isPlaying">
      <b-col>{{ firstNumber }}</b-col>
      <b-col>+</b-col>
      <b-col>{{ secondNumber }}</b-col>
    </b-row>
    <video
      @ended="videoEnded"
      src="https://rubhi-file.s3.ap-southeast-1.amazonaws.com/ghost.webm"
      v-if="ghost"
      autoplay
      preload
      id="jumpscare"
    ></video>

    <div class="card mt-5">
      <b-row class="py-3 px-3">
        <b-card
          :header="myName"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          :footer="isCreator ? 'Game Master' : 'Participant'"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="width: 10rem; min-width: 10rem; margin: 10px"
          :key="myKey"
        >
          <h1>{{ myScore }}</h1>
          <b-nav>
            <b-nav-item
              class="mx-auto"
              variant="danger"
              :disabled="isCreator"
              :link-classes="
                isCreator ? { 'text-secondary': true } : { 'text-danger': true }
              "
              @click.prevent="$router.push('/lobby')"
              v-if="!isGameEnded && !isPlaying"
              >Leave</b-nav-item
            >
          </b-nav>
        </b-card>

        <b-card
          :header="player.split('-')[1]"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer="Player"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="width: 10rem; min-width: 10rem; margin: 10px"
          v-for="(score, player) in otherPlayers"
          :key="player"
        >
          <h1>{{ score }}</h1>
        </b-card>
      </b-row>
    </div>
    <b-button
      v-if="!isGameEnded && isCreator && !isPlaying"
      :disabled="Object.keys(otherPlayers).length < 1"
      variant="success"
      class="mt-5"
      @click="startGame"
      >START GAME</b-button
    >

    <b-button
      v-if="isGameEnded"
      variant="primary"
      class="mt-5"
      @click="leaveRoom"
      >Back to Lobby</b-button
    >

    <h2
      v-if="!isGameEnded && !isCreator && !isPlaying"
      variant="success"
      class="mt-5"
    >
      Waiting for game master to start game...
    </h2>
    <br />
    <b-button variant="warning" class="mt-5" @click="showHowToPlay">
      How to Play
    </b-button>
  </b-container>
</template>

<script>
import random from "@/helpers/randomNumber";
import { mapState } from "vuex";

export default {
  beforeRouteEnter(to, from, next) {
    if (from.name) {
      next();
    } else {
      next("/");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isPlaying) {
      this.$myswal.showError("Cannot leave while playing");
      next(false);
    } else if (this.isCreator && !this.isGameEnded) {
      this.$myswal.showError("Game master cannot leave this room");
      next(false);
    } else {
      this.$myswal.showConfirmation(
        "Do you want to leave this room?",
        (result) => {
          if (result) {
            this.socket.emit("leave-room", {
              roomName: this.room,
              playerKey: this.myKey,
            });
            next();
          } else {
            next(false);
          }
        }
      );
    }
  },
  name: "playBoard",
  data() {
    return {
      firstNumber: 0,
      secondNumber: 0,
      result: 0,
      ghost: false,
      isWinning: false,
      isPlaying: false,
      isGameEnded: false,
    };
  },
  components: {},
  watch: {
    myScore(value) {
      let payload = {
        roomName: this.room,
        key: this.myKey,
        score: value,
      };
      this.socket.emit("update-score", payload);
    },
  },
  methods: {
    startGame() {
      let payload = {
        roomName: this.room,
        isPlaying: true,
      };
      this.socket.emit("change-isplaying", payload);
    },
    leaveRoom() {
      this.$router.push("/lobby");
    },
    videoEnded() {
      this.ghost = false;
    },
    generateSoal() {
      this.firstNumber = random();
      this.secondNumber = random();
      this.result = this.solution(this.firstNumber, this.secondNumber);
    },
    solution(x, y) {
      return (x + y) % 10;
    },
    listenSocketEvent() {
      this.socket.on("change-isplaying", (value) => {
        this.isPlaying = value;
      });
      this.socket.on("end-game", () => {
        this.isPlaying = false;
        this.isGameEnded = true;
        if (this.isWinning) {
          this.$myswal.showWin();
        } else {
          this.$myswal.showMessage("Sorry, you lost :(");
        }
      });
      this.socket.on("update-score", (payload) => {
        this.$store.commit("updateOtherScore", payload);
      });
      this.socket.on("player-joined", (players) => {
        this.$store.commit("setOtherPlayers", players);
      });
      this.socket.on("player-left", (players) => {
        this.$store.commit("setOtherPlayers", players);
      });
      this.socket.on("show-error", (message) => {
        this.$myswal.showError(message);
      });
    },
    handleKey(e) {
      if (e.keyCode >= 48 && e.keyCode < 58 && this.isPlaying) {
        let answer = getUserAnswer(e.keyCode);
        if (answer === this.result) {
          this.$store.commit("setMyScore", this.myScore + 1);
          let payload = {
            key: this.myKey,
            score: this.myScore,
            roomName: this.room,
          };
          this.socket.emit("update-score", payload);
          if (this.myScore === 20) {
            this.isWinning = true;
            this.socket.emit("end-game", this.room);
          }
        } else {
          this.ghost = true;
        }
        this.generateSoal();
      }
    },
    showHowToPlay() {
      this.$myswal.showHowToPlay();
    },
  },
  computed: {
    ...mapState([
      "isCreator",
      "myName",
      "myKey",
      "myScore",
      "room",
      "socket",
      "otherPlayers",
    ]),
  },
  created() {
    this.generateSoal();
    window.addEventListener("keydown", this.handleKey);
    this.listenSocketEvent();
    this.showHowToPlay();
  },
  destroyed() {
    this.socket.off("change-isplaying");
    this.socket.off("end-game");
    this.socket.off("update-score");
    this.socket.off("player-joined");
    this.socket.off("show-error");
    this.socket.off("player-left");
    window.removeEventListener("keydown", this.handleKey);
  },
};

function getUserAnswer(buttonCode) {
  switch (buttonCode) {
    case 48:
      return 0;
    case 49:
      return 1;
    case 50:
      return 2;
    case 51:
      return 3;
    case 52:
      return 4;
    case 53:
      return 5;
    case 54:
      return 6;
    case 55:
      return 7;
    case 56:
      return 8;
    case 57:
      return 9;
    default:
      return -1;
  }
}
</script>

<style scoped>
b-card-text {
  width: 100px;
  height: 100px;
}
.col {
  max-width: 10%;
  font-family: "Pacifico", cursive;
  font-family: "Abril Fatface", cursive;
  font-size: 70px;
}

.row {
  display: flex;
  justify-content: center;
}

#jumpscare {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 100;
  -ms-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);

  background-size: cover;
}
li {
  font-size: 20px;
}
</style>
