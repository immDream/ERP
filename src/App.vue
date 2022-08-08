<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    margin: 0 auto;
  }
</style>
<script>
  import Login from "./views/Login";
  export default {
    components: {
      Login,
    }
  }
</script>
