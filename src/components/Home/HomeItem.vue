<template>
  <router-link :to="to" tag="a">
    <article class="home-item">
      <span>{{ appName }}</span>
      <img :src="posterC" alt="封面" />
    </article>
  </router-link>
</template>

<script>
export default {
  name: "HomeItem",
  props: {
    poster: {
      type: String,
      default: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3691354933,2733167647&fm=26&gp=0.jpg'
    },
    to: {
      type: String,
      required: true
    },
    appName: {
      type: String,
      required: true
    }
  },
  computed: {
    posterC () {
      if (this.poster === '') return '/static/img/appDefault.png';
      else return this.poster;
    }
  }
};
</script>

<style lang="less" scoped>
.home-item {
  display: flex;
  flex-direction: column;
  width: 285px;
  height: 150px;
  border-radius: 10px;
  background: #cccccc;
  margin: 20px 25px;
  transition: 0.5s;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  &:hover {
    transform: scale(1.1);
  }
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 2rem;
    font-weight: bold;
    z-index: 1;
    text-shadow: 0 0 3px #777;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>