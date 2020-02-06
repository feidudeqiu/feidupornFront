<template>
  <div>
    <porn-head></porn-head>
    <div class="content">
      <div id="my-note" class="content-block">
        <div class="flex-row-inline" style="margin-top:20px;margin-left: 20px">
          <img class="icon-middle" src="~static/img/note.png" />
          <span class="text-h4 text-thick text-gray">我的笔记</span>
        </div>
        <div class="flex-row-wrap" style="justify-content:space-around">
          <div class="flex-row-center" v-for="item in items" v-bind:key="item.id">
            <div
              class="note-item flex-row-center icon-brow"
              :style="{'background': 'url('+item.imageurl+') no-repeat center center'}"
            >
              <span style="color: white;font-size: 20px;">{{item.text}}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="my-kit" class="content-block">
        <div class="flex-row-inline" style="margin-top:20px;margin-left: 20px">
          <img class="icon-middle" src="~static/img/kit.png" />
          <span class="text-h4 text-thick text-gray">我的工具</span>
        </div>
        <div class="flex-row-wrap" style="justify-content:space-around">
          <div class="flex-row-center" v-for="item in items" v-bind:key="item.id">
            <div
              class="note-item flex-row-center icon-brow"
              :style="{'background': 'url('+item.imageurl+') no-repeat center center'}"
            >
              <span style="color: white;font-size: 20px;">{{item.text}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div style="width:100%" class="flex-row-center">
        <div
          class="text-gray text-font"
          style="font-size: .7rem"
        >Copyright © 2020 ● 1021857669@qq.com ● feidudeqiu.github</div>
      </div>
    </div>
  </div>
</template>
<script>
import {LoginController} from "@/assets/js/common.js"
import Head from "@/Head.vue"
export default {
  name: "Index",
  components: {
    "porn-head": Head
  },
  data () {
    return {
      items: [
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "1"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "2"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "3"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "4"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "5"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "6"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "7"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "8"
        },
        {
          text: "毛概",
          imageurl:
            "https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg",
          id: "9"
        }
      ]
    };
  },
  created () {
    var that = this;
    function success () {
      that.axios.get('/api/index/get-index-mycontent').then(function (res) {
        console.info(res);
      }).catch(function (error) {
        console.info(error);
      })
    } 
    LoginController.loginControl(success);
}
};
</script>
<style scoped>
.note-item {
    display: flex;
    flex-direction: column;
    width:285px;
    height:150px;
    border-radius: 10px;
    margin-left: 25px;
    margin-right:25px;
    margin-top: 20px;
    margin-bottom:20px;
}

</style>