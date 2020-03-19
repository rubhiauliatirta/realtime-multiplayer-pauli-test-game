import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

function showError(errMessage) {
  Vue.swal({
    icon: 'error',
    text: errMessage,
  })
}

function showConfirmation(message, callback) {
  Vue.swal({
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    callback(result.value)
  })
}

function showMessage(message){
  Vue.swal(message)
}

function showWin(){
  Vue.swal({
    imageUrl: 'https://thumbs.gfycat.com/VapidRecklessGalapagosmockingbird-size_restricted.gif',
    imageHeight: 400,
    imageAlt: 'Winning image',
    title: "Congratulation, you are the winner!"
  })
}

Vue.prototype.$myswal = {
  showError,
  showConfirmation,
  showMessage,
  showWin
}