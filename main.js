import App from './App';
import '@/assets/common.scss';

// #ifndef VUE3
import Vue from 'vue';
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
  ...App,
});
app.$mount();

import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus);
  return {
    app,
  };
}
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
