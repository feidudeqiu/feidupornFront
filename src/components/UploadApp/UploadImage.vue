<template>
  <article>
    <div class="upload-img">
      <div class="left-button">
        <input title="" type="file" @change="onchange" accept="image/*" />
        <span>{{ buttonTip }}</span>
      </div>
      <div class="preview" :style="{ width: imgWidthPX, height: imgHeightPX }">
        <div v-if="mode === 0"></div>
        <vueCropper
          v-if="mode === 1"
          ref="cropper"
          :img="cropper.img"
          :outputSize="cropper.outputSize"
          :outputType="cropper.outputType"
          :info="cropper.info"
          :canScale="cropper.canScale"
          :autoCrop="cropper.autoCrop"
          :fixedBox="cropper.fixedBox"
          :full="cropper.full"
          :canMove="cropper.canMove"
          :canMoveBox="cropper.canMoveBox"
          :original="cropper.original"
          :centerBox="cropper.centerBox"
          :mode="cropper.mode"
          :auto-crop-width="imgWidth"
          :autoCropHeight="imgHeight"
        ></vueCropper>
        <img v-if="mode === 2" :src="tempUrl" alt="预览" />
      </div>
      <div class="right-buttons">
        <button :disabled="mode !== 1" @click="cutFinished">裁剪</button>
        <button :disabled="mode === 0" @click="cancel">取消</button>
      </div>
    </div>
    <footer>
      <slot name="tips"></slot>
    </footer>
  </article>
</template>

<script>
import { Message } from "view-design";

export default {
  name: "UploadImage",
  props: {
    imgWidth: {
      type: Number,
      default: 480,
    },
    imgHeight: {
      type: Number,
      default: 270,
    },
    buttonTip: {
      type: String,
      default: "上传图片",
    },
    maxSize: {
      type: Number,
      default: Number.POSITIVE_INFINITY,
    },
  },
  data () {
    return {
      mode: 0,
      imageFile: null,
      tempUrl: "",
      cropper: {
        img: "",
        outputSize: 1,
        outputType: "jpeg",
        info: true,
        canScale: true,
        autoCrop: true,
        fixedBox: true,
        full: false,
        canMove: true,
        canMoveBox: false,
        original: false,
        centerBox: true,
        mode: "cover",
      },
    };
  },
  computed: {
    imgWidthPX () {
      return `${this.imgWidth}px`;
    },
    imgHeightPX () {
      return `${this.imgHeight}px`;
    },
  },
  methods: {
    onchange (e) {
      const file = e.target.files[0];
      if (file) {
        if (this.testImg(file)) {
          this.mode = 1;
          this.cropper.img = URL.createObjectURL(file);
        }
      }
    },
    cutFinished (e) {
      e.preventDefault();
      this.$refs.cropper.getCropBlob((data) => {
        this.imageFile = data;
        this.tempUrl = URL.createObjectURL(data);
        this.mode = 2;
        this.$emit("cut-finish", data);
      });
    },
    cancel () {
      this.mode = 0;
      this.tempUrl = "";
      this.imageFile = null;
      this.cropper.img = "";
      this.$emit("cancel");
    },
    testImg (file) {
      const fileType = /^image\//;
      if (!fileType.test(file.type)) {
        Message.error("请上传图片");
        return false;
      };
      if (file.size / 1024 > this.maxSize) {
        Message.error(`请上传不大于${this.maxSize}KB的图片`);
        return false;
      }
      return true;
    },
    reset () {
      this.mode = 0;
      this.imageFile = null;
      this.tempUrl = "";
    }
  },
}
</script>

<style lang="less" scoped>
@color: #409eff;
@shadowColor: #777;

.button-font {
  font-size: 12px;
  color: #fff;
  writing-mode: vertical-lr;
  text-shadow: 0 0 5px #fff;
  line-height: 2rem;
}
.upload-img {
  display: flex;
  .left-button {
    width: 2rem;
    position: relative;
    overflow: hidden;
    input {
      top: 0;
      right: 0;
      position: absolute;
      opacity: 0;
      height: 100%;
      z-index: 1;
      cursor: pointer;
      &:hover + span {
        box-shadow: 0 0 5px #fff inset;
      }
    }
    span {
      &:extend(.button-font all);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: @color;
    }
  }
  .preview {
    box-shadow: 0 0 5px #ccc inset;
    div,
    img {
      width: 100%;
      height: 100%;
    }
    div {
      background: url("/static/img/preview.svg") center center no-repeat;
      background-size: 100px auto;
    }
  }
  .right-buttons {
    width: 2rem;
    position: relative;
    button {
      &:extend(.button-font all);
      position: absolute;
      height: 50%;
      width: 100%;
      background: @color;
      left: 0;
      right: 0;
      border: none;
      border-radius: 0;
      cursor: pointer;
      &:first-child {
        top: 0;
      }
      &:last-child {
        background: #d179e7;
        bottom: 0;
      }
      &:hover {
        box-shadow: 0 0 5px #fff inset;
      }
      &:disabled {
        background: #ccc;
        box-shadow: unset;
        cursor: no-drop;
      }
    }
  }
}
footer {
  text-align: left;
  font-size: 12px;
  line-height: 3em;
}
</style>