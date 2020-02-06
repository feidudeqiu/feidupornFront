<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import 'vant/lib/index.css';
export default {
  name: 'App',
  data () {
        return {
           
        }
    }
}
</script>

<style>
@import url("../static/css/display.min.css");
@import url("../static/css/common.min.css");
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
}
</style>
