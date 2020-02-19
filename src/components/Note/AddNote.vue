<template>
    <div>
        <porn-head></porn-head>
        <div style="width:100%;padding-left:30px;padding-right:30px;display:flex;flex-direction:row;align-items:flex-start;justify-content:space-around">
            <Drawer :closable="true" @on-close="setFlag = false" :scrollable="true" :width="300" placement="left" title="设置" v-model="setFlag">
                <div class="flex-column-inline" style="width:270px;">
                    <div class="set-item">
                        <span>发布形式：</span>
                        <RadioGroup v-model="noteType">
                            <Radio label="public">
                                <span>公开</span>
                            </Radio>
                            <Radio label="hidden">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                    <div class="set-item">
                        <span>允许评论：</span>
                        <RadioGroup v-model="commentable">
                            <Radio label="true">
                                <span>是</span>
                            </Radio>
                            <Radio label="false">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                    <div class="flex-row-inline" style="justify-content:space-around;margin-bottom:20px;margin-top:10px;">  
                        <button style="width:90px;height:30px;background:#19be6b;color:white;cursor:pointer" @click="upload()">发布</button>
                        <button style="width:90px;height:30px;background:#2b85e4;color:white;cursor:pointer">保存到草稿</button>
                    </div>
                </div>
            </Drawer>
            <div style="width:100%;display:flex;flex-direction:column;padding-bottom:10px;">
                <Input placeholder="文章标题" v-model="title" type="textarea" maxlength="100" show-word-limit style="width:100%;margin-top:20px;margin-bottom:20px;box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px"/>
                <mavon-editor @imgAdd="$imgAdd" @imgDel="$imgDel"
                    v-model="content" ref="md" style="flex:1;min-height: 450px;width:100%;" :style="{'z-index':zIndex}" placeholder="文章正文" @fullScreen="zIndex = 100" />
            </div>
        </div>
        <img v-if="!setFlag" style="position:absolute;left:0;top:50%;cursor: pointer;width:30px;height:30px;" src="~static/img/right-arrow.png" :style="{'top': height + 'px'}" @click="setFlag = true"/>
    </div>
</template>
<style scoped>
.set-font {
    color: black; 
}
.slider {
    margin-top: 20px;
    margin-bottom: 20px;
}
>>> .ivu-input {
    border:none;
}
>>> textarea::-webkit-input-placeholder {
    color: #C5CCDC;
}
button {
    border:none;
    border-radius:5px;
}
span {
    color:#808695;
}
.set-item {
    width:250px;
    margin-left:10px;
    margin-right:10px;
    margin-top:10px;
    margin-bottom:5px;
    padding-bottom:5px;
    padding-left:20px;
    border-bottom:1px solid #e8eaec;
    display:flex;
    flex-direction: row;
    align-items: flex-start;
}
.set-item:last-child {
    border-bottom: none;
}
</style>
<script>
import { mavonEditor } from 'mavon-editor'
import { Drawer, Input, Affix, RadioGroup, Radio } from 'view-design';
import Head from "@/Head.vue"
import 'mavon-editor/dist/css/index.css'
export default {
    name: "AddNote",
    components: {
        mavonEditor,
        "porn-head": Head,
        Input,
        Affix,
        Drawer,
        RadioGroup, Radio
    },
    data () {
        return {
            title: '',
            content: '',
            zIndex: 0,
            noteType: 'public',
            commentable: 'true',
            img_file: {},
            setFlag: false,
            height: 325
        }
    },
    mounted () {
        var that = this;
        this.windowScroll();
        window.addEventListener('scroll', this.windowScroll);
        window.onresize = function () {
            that.windowScroll();
        }
    },
    methods: {
        $imgAdd (pos, $file) {
            // 缓存图片信息
            this.img_file[pos] = $file;
        },
        $imgDel (pos) {
            delete this.img_file[pos];
        },
        upload () {
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            for (var _img in this.img_file) {
                formdata.append(_img, this.img_file[_img]);
            }
            formdata.append("content", new Blob([this.content]));
            this.axios({
                url: '/api/note/add-note?' + 
                    'title=' + this.title + 
                    '&noteType=' + this.noteType + 
                    '&commentable=' + this.commentable,
                method: 'post',
                data: formdata,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                var files = res.data.files;
                for (let [key, value] of Object.entries(files)) {
                    // $vm.$img2Url 详情见本页末尾
                    this.$refs.md.$img2Url(key, value);
                }
                this.axios({
                    url: '/api/'
                })
            }).catch((err) => {
                console.info("err");
                console.info(err);
            })
        },
        windowScroll () {
            this.height = window.innerHeight / 2 + document.documentElement.scrollTop;
        }
    },
    beforeDestroy () {
 	    window.removeEventListener('scroll', this.windowScroll)
    }

}
</script>