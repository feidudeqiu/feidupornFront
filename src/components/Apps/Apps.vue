<template>
  <main class="apps">
    <porn-head></porn-head>
    <div class="app-iframe">
      <iframe :src="url">
      </iframe>
    </div>
    <div class="app-info">
      <pre>作者：{{info.author}}<br/>{{info.descriptions}}</pre>
    </div>
  </main>
</template>

<script>
  import { Message } from 'view-design';
  import { getAppInfo } from 'network/apps';
  import Head from '@/Head.vue';

  export default {
    name: "Apps",
    components: {
        "porn-head": Head,
    },
    data () {
      return {
        url: '',
        info: {
          author: 'aling',
          descriptions: '唱彻《阳关》泪未干，功名馀事且加餐。浮天水送无穷树，带雨云埋一半山。今古恨，几千般，只应离合是悲欢？江头未是风波恶，别有人间行路难'
        }
      };
    },
    created () {
      this.init();
    },
    methods: {
      init () {
        let name = this.$route.params.appname;
        if (!name) {
          this.$router.replace('/');
        } else {
          this.url = `http://localhost:8001/apps/${name}`;
          getAppInfo(name)
          .then(success => {
            if (success.code === 0) this.info = success.info;
            else Message.error('获取信息失败');
          }, err => {
            let message = '获取信息失败';
            if (err.status === 500) {
              message = '获取信息失败';
            } else if (err.status === 404) {
              message = 'app不存在';
              this.$router.replace('/');
            }
            Message.error(message);
          });
        }
      },
    }
  };
</script>

<style lang="less" scoped>
  .app-common {
    border: 2px solid #eeeeee;
    border-radius: 5px;
    padding: 10px;
    @media (min-width: 770px) {
      width: 720px;
      height: 480px;
    }
    @media (min-width: 1080px) {
      width: 1080px;
      height: 720px;
    }
    @media (max-width: 770px) {
      width: 100vw;
      height: 100vh;
      border: none;
      border-radius: 0;
      padding: 0;
      margin: 0;
      border: none;
    }
  }
  .apps {
    .app-iframe {
      &:extend(.app-common all);
      margin: 30px auto;
      margin-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      iframe {
        width: 100%;
        height: 100%;
        border: 1px solid #eeeeee;
      }
    }
    .app-info {
      &:extend(.app-common all);
      margin: 0 auto;
      margin-bottom: 30px;
      height: auto;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: none;
      pre {
        padding: 1em 1.5em;
        box-shadow: 0 0 5px #ccc inset;
        font-size: 12px;
        text-align: left;
        white-space: pre-line;
        word-break: break-all;
      }
    }
  }
</style>