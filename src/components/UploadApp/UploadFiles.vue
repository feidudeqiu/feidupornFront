<template>
  <article class="upload-files">
    <div class="file-input">
      <input type="file" :multiple="multiple" :accept="accept.join(',')" @change="onchange">
      <span>点击上传文件</span>
    </div>
    <div class="file-list">
      <ul>
        <li v-for="file of files" :key="file.name">
          <span>{{file.name}}</span>
          <span>{{`${(file.size / 1024).toFixed(2)}K`}}</span>
          <button type="button" @click="onCancel(file.name)"></button>
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
  import { Message } from 'view-design';

  export default {
    name: 'UploadFiles',
    props: {
      accept: {
        type: Array,
        default () {
          return ['*']
        },
      },
      multiple: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        files: [],
        fileNames: new Set()
      };
    },
    methods: {
      onchange (e) {
        const files = [...e.target.files];
        if (this.multiple) {
          files.forEach(item => {
            if (this.fileNames.has(item.name) || item.name === 'index.html') {
              Message.error('其他文件中不能含有相同文件名的文件，并且文件名不能为index.html');
            } else {
              this.fileNames.add(item.name);
              this.files.push(item);
            }
          });
        } else {
          this.files = [files[0]]
        };
        e.target.value = '';
        this.$emit('change-files', this.files);
      },
      onCancel (fileName) {
        if (this.multiple) {
          let index = this.files.findIndex(item => item.name === fileName);
          this.$delete(this.files, index);
          this.fileNames.delete(fileName);
        } else {
          this.files = [];
        }
        this.$emit('change-files', this.files);
      },
      reset () {
        this.files = [];
        this.fileNames.clear();
      },
    },
  }
</script>

<style lang="less" scoped>
  @keyframes lili {
    0% {
      height: 0;
    }
    100% {
      height: 1.5em;
    }
  }
  .upload-files {
    display: flex;
    flex-direction: column;
    justify-content: left;
    .file-input {
      overflow: hidden;
      width: 150px;
      height: 32px;
      border: 1px solid #dcdee2;
      border-radius: 5px;
      position: relative;
      input {
        opacity: 0;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
      }
      &:hover {
        border: 1px solid #57a3f3;
      }
      &:active {
        box-shadow: 0 0 3px #57a3f3;
      }
    }
    .file-list {
      width: 100%;
      ul {
        list-style: none;
        padding: .5rem 1rem;
        background: #eeeeee;
        border-radius: 5px;
        margin-top: .5rem;
        color: #777;
        transition: .5;
        box-sizing: border-box;
        &:empty {
          display: none;
        }
        li {
          animation: lili 1s 1;
          display: flex;
          line-height: 1.5em;
          padding: 0 .5rem;
          border-radius: 1px;
          overflow: hidden;
          &:hover {
            background: rgba(200, 200, 200, .5);
          }
          span {
            &:nth-child(1) {
              margin-right: auto;
              text-decoration: underline;
            }
          }
          button {
            width: 1.5em;
            height: 1.5em;
            border: none;
            background: url('/static/img/fileCancel.svg') center center no-repeat;
            background-size: 1em 1em;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>