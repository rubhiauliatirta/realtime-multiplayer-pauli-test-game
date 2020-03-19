import Vue from 'vue'
import Vuex from 'vuex'
//import db from '@/fb'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket : null,
    room:"",
    isCreator : false,
    myKey : "",
    myName : "",
    myScore:"",
    otherPlayers:{}
  },
  mutations: {
    resetState(state, payload){
      state.room = "",
      state.isCreator  =  false,
      state.myKey  =  "",
      state.myScore = 0,
      state.otherPlayers = {}

    },
    setRoom(state,payload){
      state.room = payload
    },
    setIsCreator(state,payload){
      state.isCreator = payload
    },
    setMyKey(state,payload){
      state.myKey = payload
    },
    setMyName(state,payload){
      state.myName = payload
    },
    setMyScore(state,payload){
      state.myScore = payload
    },
    setOtherPlayers(state,payload){
      delete payload[state.myKey]
      console.log(payload)
      state.otherPlayers = payload
    },
    updateOtherScore(state, payload){
      state.otherPlayers[payload.key] = payload.score
    },
    setSocket(state, payload){
      state.socket = payload
    }
  },
  actions: {
   
  }
})
