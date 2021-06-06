import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.use(VueSweetalert2)

function showError (errMessage) {
  Vue.swal({
    icon: 'error',
    text: errMessage
  })
}

function showConfirmation (message, callback) {
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

function showMessage (message) {
  Vue.swal(message)
}

function showWin () {
  Vue.swal({
    imageUrl: 'https://thumbs.gfycat.com/VapidRecklessGalapagosmockingbird-size_restricted.gif',
    imageHeight: 400,
    imageAlt: 'Winning image',
    title: 'Congratulation, you are the winner!'
  })
}

function showHowToPlay () {
  Vue.swal({
    title: '<strong>How to Play</strong>',
    icon: 'info',
    width: '70%',
    html: `
    <ul class="text-left border px-5 py-3">
      <li>Game bisa dimulai oleh game master ketika di dalam room sudah ada 4 orang player.</li>
      <li>Setelah game dimulai, nanti akan muncul 2 angka yang harus ditambahkan, jawaban yang benar adalah angka satuan dari hasil penambahan. Contoh:</li>
      <ul>
        <li>2 + 4 = <strong>6</strong> => Jawaban yang tepat adalah <strong>6</strong></li>
        <li>9 + 4 = 1<strong>3</strong> => Jawaban yang tepat adalah <strong>3</strong></li>
        <li>5 + 7 = 1<strong>2</strong> => Jawaban yang tepat adalah <strong>2</strong></li>
      </ul>
      <li>Tekan tombol angka pada keyboard laptop kalian untuk menjawab pertanyaan.</li>
      <li>JANGAN SAMPAI SALAH. POKOKNYA JANGAN. :)</li>
      <li>Pemain yang pertama kali mencapai score 20 akan memenangkan pertandingan.</li>
    </ul>
    `,
    confirmButtonText: 'OK'
  })
}

Vue.prototype.$myswal = {
  showError,
  showConfirmation,
  showMessage,
  showWin,
  showHowToPlay
}
