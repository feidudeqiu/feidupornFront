<template>
  <div id="app" style="height:100%;">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
import 'view-design/dist/styles/iview.css';
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
