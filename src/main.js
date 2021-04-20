import Vue from 'vue'
import App from './App.vue'

import { Field, Input, Radio, Taginput } from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Field);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Taginput);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
