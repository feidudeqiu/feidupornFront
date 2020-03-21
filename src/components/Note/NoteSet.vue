<template>
    <div class="flex-column-center">
        <porn-head></porn-head>
        <div class="flex-column-center" style="width:100%;padding-bottom:10px;">
            <div class="flex-column-center" style="width:90%;">
                <div class="flex-row-inline" style="width:100%;margin-top:20px;">
                    <Breadcrumb style="margin-right:20px;">
                        <BreadcrumbItem>
                            <img style="width:20px;height:20px;" src="~static/img/books.png"><span>{{setTitle}}</span>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <img style="width:20px;height:20px;" src="~static/img/book.png"><span class="hover" style="cursor:pointer" @click="listFlag = !listFlag">{{noteTitle}}</span>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <div v-if="isOwn" style="border-left:1px solid #dcdee2;width:1px;height:20px;margin-right:10px;"></div>
                    <img v-if="isOwn" title="编辑" @click="$router.push('/editNote?noteNo='+target)" style="cursor:pointer;width:20px;height:20px;" src="~static/img/edit.png">
                </div>
                <mavonEditor :value="content" style="flex:1;min-height: 450px;width:100%;margin-top:20px;" :subfield="false" :defaultOpen="'preview'" :toolbars="toolbars"
                    :style="{'z-index':zIndex}" @fullScreen="zIndex = 100" >
                </mavonEditor>
            </div>
        </div>
        <Drawer :closable="true" @on-close="listFlag = false" :scrollable="true" :width="350" placement="right" title="笔记列表" v-model="listFlag">
            <List class="list">
                <ListItem  class="listItem" :style="{background:(target===note.noteNo?'#f4f4f4':''),cursor:(target===note.noteNo?'':'pointer')}" v-for="note in noteList" v-bind:key="note.noteNo">
                    <div class="flex-row-inline" @click="getNote(note.noteNo)">
                        <div style="color:#808695;width:60px;text-align:center;">{{note.noteNo}}</div>
                        <span style="margin-left:10px;">{{note.title}}</span>
                    </div>
                </ListItem>
            </List>
        </Drawer>
        <img v-if="!listFlag" style="position:absolute;right:0;cursor: pointer;width:30px;height:30px;" src="~static/img/left-arrow.png" :style="{'top': height + 'px'}" @click="listFlag = true"/>
    </div>
</template>
<style scoped>
.listItem {
    padding-left:20px;
    padding-right:20px;
}
.listItem:hover {
    background: #f4f4f4;
}
.hover:hover {
    color:#2d8cf0;
}
>>>.ivu-drawer-body::-webkit-scrollbar {
    width: 0px;
}
</style>
<script>
import {Drawer, List, ListItem, Message, Breadcrumb, BreadcrumbItem} from "view-design"
import { mavonEditor } from 'mavon-editor'
import Head from "@/Head.vue"
export default {
    name: "NoteSet",
    components: {
        "porn-head": Head,
        mavonEditor,
        Drawer,
        List, ListItem,
        Breadcrumb, BreadcrumbItem
    },
    data () {
        return {
            zIndex: 0,
            toolbars: {
                readmodel: true,
                navigation: true
            },
            noteTitle: '',
            setTitle: '',
            target: 0,
            listFlag: false,
            height: 0,
            isOwn: false,
            content: "加载中",
            noteList: [
                
            ]
        }
    },
    methods: {
        unsignedLoad () {
            var that = this;
            var url = '/api/note-set/get-notes?setNo=' + that.$route.query.noteSetNo;
            if (that.$route.query.noteNo) {
                url += '&noteNo=' + that.$route.query.noteNo;
            }
            console.info(that.$route.query.noteSetNo);
            if (that.$route.query.noteSetNo === '0') {
                url += '&username=' + that.$route.query.username;
            } 
            this.axios.get(url).then(function (res) {
                console.info(res);
                that.content = res.data.content;
                that.noteList = res.data.noteList;
                that.setTitle = res.data.setTitle;
                if (that.$route.query.noteNo) {
                    that.target = parseInt(that.$route.query.noteNo);
                    for (let i = 0; i < that.noteList.length; i++) {
                        if (that.target === that.noteList[i].noteNo) {
                            that.noteTitle = that.noteList[i].title;
                            that.isOwn = that.noteList[i].isOwn;
                        }
                    }
                } else {
                    that.target = res.data.noteList[0].noteNo;
                    that.noteTitle = res.data.noteList[0].title;
                    that.isOwn = res.data.noteList[0].isOwn;
                }
            }).catch(function (err) {
                Message.error(err.response.data.msg)
            })
        },
        getNote (noteNo) {
            console.info(' ' + noteNo + ' ' + this.target)
            if (noteNo === this.target) {
                return;
            }
            var that = this;
            that.content = '';
            that.target = noteNo;
            for (let i = 0; i < this.noteList.length; i++) {
                if (noteNo === this.noteList[i].noteNo) {
                    this.noteTitle = this.noteList[i].title;
                    this.isOwn = this.noteList[i].isOwn;
                }
            }
            this.axios.get('/api/note/get-note?noteNo=' + noteNo)
            .then(function (res) {
                that.content = res.data;
            })
            .catch(function (err) {
                Message.error(err.response.data.msg)
            })
        },
        windowScroll () {
            this.height = window.innerHeight / 2 + document.documentElement.scrollTop;
        }
    },
    mounted () {
        var that = this;
        this.windowScroll();
        that.windowHeight = window.innerHeight;
        window.addEventListener('scroll', this.windowScroll);
        window.onresize = function () {
            that.windowScroll();
            that.windowHeight = window.innerHeight;
        }
    }
}
</script>