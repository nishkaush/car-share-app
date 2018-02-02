import Vue from "vue";
import "normalize.css/normalize.css";
import Vuetify from "vuetify";
import { store } from "./Store/Store.js";
import App from "./app.vue";
import { router } from "./Router/index.js";
import "vuetify/dist/vuetify.min.css";
import apolloProvider from "./Apollo/apollo";

Vue.use(Vuetify);

const myInstance = new Vue({
  el: "#app",
  store,
  router,
  apolloProvider,
  render: h => h(App)
  //render function tells vue to render the "App" element inside the div with id=app. Without it, you will get an error about compiling.
  //render function is the javascript equivalent of <App></App>. It tells Vue where and what to add as an element
});

// {
// "build": "webpack --config ./config/webpack.prod.js",
// "dev": "webpack-dev-server --config ./config/webpack.dev.js"
//}
