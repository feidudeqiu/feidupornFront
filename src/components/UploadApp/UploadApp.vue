<template>
  <div>
    <porn-head></porn-head>
    <main class="upload">
      <Form ref="uploadForm" :model="uploadForm" :label-width="80" :rules="rules">
        <FormItem label="封面">
          <upload-image
            ref="frontCover"
            @cut-finish="uploadForm.frontCover = $event"
            @cancel="uploadForm.frontCover = null"
            :img-width="285"
            :img-height="150"
            button-tip="上传封面"
            :max-size="2048"
          >
            <template #tips>提示：裁剪过程中可使用鼠标拖动和缩放图片</template>
          </upload-image>
        </FormItem>
        <FormItem label="名字" prop="chName">
          <Input v-model="uploadForm.chName"
            :show-word-limit="true"
            placeholder="可包含中文、字母和数字（3-10字）"
          ></Input>
        </FormItem>
        <FormItem label="英文代号" prop="enName">
          <Input
            v-model="uploadForm.enName"
            :show-word-limit="true"
            placeholder="可包含字母、数字和下划线（3-30字符）"
          ></Input>
        </FormItem>
        <FormItem 
          label="主页面" 
          prop="index" 
          ref="index" 
          :showMessage="indexShowMessage"
        >
          <upload-files
          ref="innerIndex" 
          v-model="uploadForm.index" 
          @change-files="uploadForm.index = $event" 
          :accept="['text/html']" 
          :multiple="false"></upload-files>
        </FormItem>
        <FormItem label="其他文件">
          <upload-files
          ref="deps" 
          @change-files="uploadForm.deps = $event" 
          :accept="['text/html', 'text/javascript', 'text/css', 'image/jpeg', 'image/png', 'image/gif']" 
          :multiple="true"></upload-files>
        </FormItem>
        <FormItem label="描述" prop="descriptions">
          <Input
            v-model="uploadForm.descriptions" 
            type="textarea" 
            :autosize="{minRows: 2,maxRows: 5}" 
            placeholder="200字以内"
            :show-word-limit="true"
          ></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit">提交</Button>
            <Button @click="handleReset" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </main>
  </div>
</template>

<script>
import { Form, FormItem, Input, Button, Message } from 'view-design';
import UploadImage from './UploadImage';
import UploadFiles from './UploadFiles';
import { validateChName, validateEnName, validateIndexPage } from './formValidators';
import { uploadApp } from 'network/uploadApp';
import Head from '@/Head.vue'
export default {
  name: "UploadApp",
  data () {
    return {
      uploadForm: {
        frontCover: null,
        chName: '',
        enName: '',
        index: [],
        deps: [],
        descriptions: '',
      },
      rules: {
        chName: [
          { required: true, type: 'string', message: '请输入名字', trigger: 'change' },
          { min: 3, max: 10, message: '长度不符合要求', trigger: 'change' },
          { validator: validateChName, trigger: 'change' },
        ],
        enName: [
          { required: true, type: 'string', message: '请输入英文代号', trigger: 'change' },
          { min: 3, max: 30, message: '长度不符合要求', trigger: 'change' },
          { validator: validateEnName, trigger: 'change' },
        ],
        index: [
          { required: true, message: '请上传主页文件' }
        ],
        descriptions: [
          { max: 200, type: 'string', message: '200个字以内', trigger: 'change' },
        ]
      },
      indexShowMessage: false
    };
  },
  mounted () {
    this.initForm();
  },
  methods: {
    initForm () {
      this.$refs.index.validateState = '';
      this.indexShowMessage = true;
    },
    handleSubmit () {
      this.$refs.uploadForm.validate(valid => {
        if (this.uploadForm.index.length === 0) {
          valid = false;
        }
        if (valid) {
          uploadApp(this.uploadForm)
          .then(success => {
            switch (success) {
              case 0: Message.success('上传成功！'); break;
              case 1: Message.error('名字不符合标准，上传失败'); break;
              case 2: Message.error('英文代号不符合标准，上传失败'); break;
              case 3: Message.error('英文代号已被他人使用'); break;
              case 4: Message.error('请上传一个html文件作为主页'); break;
              case 5: Message.error('文件类型不正确'); break;
              case 6: Message.error('描述不应超过200个字'); break;
              case 7: Message.error('文件上传过程中发生错误！'); break;
              default: Message.error('未知错误，上传失败')
            }
          }, fail => {
            Message.error('上传失败！');
          });
        }
      })
    },
    handleReset () {
      this.$refs.uploadForm.resetFields();
      this.uploadForm.frontCover = null;
      this.uploadForm.index = [];
      this.uploadForm.deps = [];
      this.$refs.frontCover.reset();
      this.$refs.innerIndex.reset();
      this.$refs.deps.reset();
    },
  },
  components: {
    Form,
    FormItem,
    Input,
    Button,
    UploadImage,
    UploadFiles,
    "porn-head": Head
  },
};
</script>

<style lang="less" scoped>
  .upload {
    margin: 2rem 8%;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;
    min-width: 780px;
  }
</style>