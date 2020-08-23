<template>
    <div class="flex-column-center">
        <porn-head></porn-head>
        <div class="flex-column-center" style="width:100%;padding-bottom:10px;">
            <div class="flex-column-center" style="width:90%;">
                <div class="flex-row-inline" style="width:100%;margin-top:20px;">
                    <span>{{noteTitle}}</span>
                    <div v-if="isOwner" style="border-left:1px solid #dcdee2;width:1px;height:20px;margin-right:10px;"></div>
                    <img v-if="isOwner" title="编辑" @click="$router.push('/editNote?noteNo='+target)" style="cursor:pointer;width:20px;height:20px;" src="~static/img/edit.png">
                </div>
                <mavonEditor :value="content" style="flex:1;min-height: 450px;width:100%;margin-top:20px;" :subfield="false" :defaultOpen="'preview'" :toolbars="toolbars"
                    :style="{'z-index':zIndex}" @fullScreen="zIndex = 100" >
                </mavonEditor>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>
<script>
import { mavonEditor } from 'mavon-editor'
import { Message } from "view-design"
import Head from "@/Head.vue"
export default {
    name: "Note",
    components: {
        "porn-head": Head,
        mavonEditor
    },
    data () {
        return {
            toolbars: {
                readmodel: true,
                navigation: true
            },
            noteTitle: '',
            isOwner: false,
            content: "加载中",
            lastModifiedTime: '',
            createTime: ''
        }
    },
    created () {
        if (this.$route.query.noteNo) {
            this.getNote(this.$route.query.noteNo);
        } else {
            Message.error("请输入文章编号");
        }
    },
    methods: {
        getNote (noteNo) {
            if (noteNo === this.target) {
                return;
            }
            var that = this;
            that.content = '';
            this.axios.get('/api/note/get-note?noteNo=' + noteNo)
            .then(function (res) {
                that.content = res.data;
            })
            .catch(function (err) {
                Message.error(err.response.data.msg)
            })
            this.axios.get('/api/note/get-note-infor?noteNo=' + noteNo)
            .then(function (res) {
                that.noteTitle = res.data.title;
                that.lastModifiedTime = res.data.lastModifiedTime;
                that.createTime = res.data.createTime;
                that.isOwner = res.data.isOwner;
            })
            .catch(function (err) {
                console.info(err.response.data.msg);
            })
        },
        windowScroll () {
            this.height = window.innerHeight / 2 + document.documentElement.scrollTop;
        }
    }
}
</script>