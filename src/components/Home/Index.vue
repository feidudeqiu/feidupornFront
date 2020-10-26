<template>
  <div style="height:100%;display:flex;flex-direction:column">
    <porn-head></porn-head>
    <div class="content" style="flex:1;">
      <div id="my-note" class="content-block">
        <div class="flex-row-inline" style="margin-top:20px;margin-left: 20px">
          <img class="icon-middle" src="~static/img/note.png" />
          <span class="text-h4 text-thick text-gray">我的文集</span>
        </div>
        <div class="flex-row-wrap" style="justify-content:space-around">
          <div class="flex-row-center" style="margin-left: 25px;margin-right:25px;margin-top: 20px;margin-bottom:20px;" v-for="noteSet in noteSetList" v-bind:key="noteSet.setNo">
            <a :href="'noteSet?noteSetNo='+noteSet.setNo">
              <div
              class="note-item flex-row-center icon-brow"
              style="background-repeat:no-repeat;background-size:cover;background-position:center"
              :style="{'background-image': 'url('+noteSet.image+')'}"
              >
              <span style="color: white;font-size: 20px;">{{noteSet.title}}</span>
            </div>
            </a>
          </div>
        </div>
      </div>
      <div id="my-kit" class="content-block">
        <div class="flex-row-inline" style="margin-top:20px;margin-left: 20px">
          <img class="icon-middle" src="~static/img/kit.png" />
          <span class="text-h4 text-thick text-gray">我的工具</span>
        </div>
        <div class="flex-row-wrap" style="justify-content:space-around">
          <home-item v-for="app of appList" :key="app.enName" :poster="app.poster" :to="'/apps/' + app.enName" :app-name="app.chName"></home-item>
        </div>
      </div>
    </div>
    <div class="foot">
      <div style="width:100%" class="flex-column-center">
        <div class="text-gray text-font" style="font-size: .7rem">Copyright © 2020 ● 1021857669@qq.com ● feidudeqiu.github</div>
        <a target="_blank" href="http://www.beian.miit.gov.cn" style="font-size: .7rem">赣ICP备20000204号-1</a>
      </div>
    </div>
  </div>
</template>
<script>
import Head from '@/Head.vue';
import HomeItem from './HomeItem';
import { getApps } from 'network/home';
import { Message } from 'view-design';

export default {
  name: "Index",
  components: {
    "porn-head": Head,
    HomeItem
  },
  data () {
    return {
      noteSetList: [],
      appList: []
    }
  },
  methods: {
    load () {
      var that = this;
      this.axios.get('/api/note-set/get').then(function (res) {
        that.noteSetList = res.data.noteSetList;
      }).catch(function (error) {
        console.info(error);
      });
      getApps()
      .then(success => {
        if (success.code === 0) {
          this.appList = success.appList;
        } else {
          Message.error('获取信息失败');
        }
      }, err => {
        Message.error('获取信息失败');
        console.log(err);
      });
    }
  },
};
</script>
<style scoped>
.note-item {
    display: flex;
    flex-direction: column;
    width:285px;
    height:150px;
    border-radius: 10px;
}

</style>