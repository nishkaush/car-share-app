<template>
<v-layout class="text-xs-center">
  <v-flex xs12 md8 offset-md2>
    <my-tabbed-content></my-tabbed-content>
  </v-flex>
</v-layout>
</template>

<script>
import TabbedContent from "./TabbedContent.vue";
export default {
  components: {
    "my-tabbed-content": TabbedContent
  }
};
</script>
