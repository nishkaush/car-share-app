<template>
  <v-app dark>
    <my-header></my-header>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
import Header from "./components/Header/Header.vue";
export default {
  data() {
    return {};
  },
  components: {
    "my-header": Header
  }
};
</script>

<style lang="scss">
button {
  cursor: pointer;
}
</style>


