<template>
    <div>
        <porn-head></porn-head>
        <Drawer :closable="true" :draggable="true" @on-close="setFlag = false" :scrollable="true" :width="330" :mask="false" placement="left" title="笔记集" v-model="setFlag">
            <Table :width="296" :max-height="windowHeight-90" :columns="setColumns" :data="setData">
                <template slot-scope="{ index }" slot="index">
                    <span>{{index}}</span>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <img src="~static/img/delete.png" style="width:20px;height:20px;cursor: pointer;" @click="deleteNote(row, index)"/>
                </template>
            </Table>
        </Drawer>
        <Drawer :closable="true" :draggable="true" @on-close="noteFlag = false" :scrollable="true" :width="840" :mask="false" placement="right" title="笔记列表" v-model="noteFlag">
           <div style="width:100%;margin-bottom:20px;">
                <div class="flex-row-inline" style="margin-bottom:10px;">
                    <span style="font-weight:600;font-size:14px;margin-right:30px;">全局搜索</span>
                    <iview-input  @on-search="getNoteByNoteNo()" size="small" v-model="globalNoteNo" type="number" style="width:200px;" search enter-button placeholder="按编号搜索" />
                </div>
                <div v-if="globalNote" class="flex-row-inline">
                    <div style="width:120px;text-align:center;">{{globalNote.noteNo}}</div>
                    <div style="width:250px;text-align:center;">{{globalNote.title}}</div>
                    <div style="width:220px;text-align:center;">{{globalNote.createTime}}</div>
                    <div style="width:210px;" class="flex-row-center"><img :src="setNoteMapper[globalNote.noteNo]?'../../../static/img/delete.png':'../../../static/img/add.png'" style="width:20px;height:20px;cursor: pointer;" @click="setNoteMapper[globalNote.noteNo]?deleteGlobalNote():addGlobalNote()"/></div>
                </div>
                <div v-else>
                    <div style="width:100px;text-align:center;">无结果</div>
                </div>
           </div>
           
           <Table :width="802" :max-height="windowHeight-100" :columns="noteColumns" :data="noteData.filter(data => !search || data.title.includes(search))">
                <template slot-scope="{ row, index }" slot="action">
                    <img :src="setNoteMapper[row.no]?'../../../static/img/delete.png':'../../../static/img/add.png'" style="width:20px;height:20px;cursor: pointer;" @click="setNoteMapper[row.no]?deleteNoteFromNotes(row):addNote(index)"/>
                </template>
            </Table>
        </Drawer>
        <img v-if="!setFlag" style="position:absolute;left:0;cursor: pointer;width:30px;height:30px;" src="~static/img/right-arrow.png" :style="{'top': height + 'px'}" @click="setFlag = true"/>
        <img v-if="!noteFlag" style="position:absolute;right:0;cursor: pointer;width:30px;height:30px;" src="~static/img/left-arrow.png" :style="{'top': height + 'px'}" @click="noteFlag = true"/>
        <div class="content">
            <div class="flex-column-center" style="margin-top:30px;">
                <div style="width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
                    <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">创建文集</span>
                </div>
                <div class="note-item flex-row-center icon-brow" style="background-repeat:no-repeat;background-size:cover;background-position:center"
                    :style="{'background-image': 'url('+image+')'}">
                    <span style="color: white;font-size: 20px;">{{title}}</span>
                </div>
                <iview-input placeholder="添加主题" v-model="title" type="textarea" maxlength="50" show-word-limit style="width:50%;min-width:300px;margin-bottom:20px;box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px"/>
                <iview-input placeholder="图片地址(仅支持网络图片)" v-model="image" type="url" maxlength="100" show-word-limit style="width:50%;min-width:300px;margin-bottom:20px;box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 12px 0px">
                    <Icon style="cursor: pointer;" type="ios-cloud-upload" slot="prefix" @click="uploadLoaclImage()" />
                </iview-input>
                <div class="flex-row-inline" style="width:50%;">
                    <div style="display:flex;flex:5;justify-content:flex-start">
                        <span style="color:#9ea7b4;font-size:14px">允许评论：</span>
                        <RadioGroup v-model="noteSetType">
                            <Radio label="public">
                                <span>公开</span>
                            </Radio>
                            <Radio label="hidden">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                    <div style="display:flex;flex:3;justify-content:flex-start">
                        <span style="color:#9ea7b4;font-size:14px">笔记数：</span>
                        <span style="color:#464c5b;font-size:14px">{{setData.length}}</span>
                    </div>
                    <button @click="createNoteSet()" class="flex-row-center" style="border:none;border-radius:5px;flex:2;cursor:pointer;height:30px;color:white;background:#337ab7">
                        <span>创建</span>
                    </button>
                </div>
            </div>
        
        </div>
    </div>
</template>
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
<script>
import Head from "@/Head.vue"
import {Table, Drawer, Input, Icon, RadioGroup, Message, Radio} from "view-design"
export default {
    name: "AddNoteSet",
    components: {
        "porn-head": Head,
        "iview-input": Input,
        Table,
        Drawer,
        Icon,
        RadioGroup, Radio
    },
    data () {
        return {
            globalNoteNo: '',
            globalNote: '',
            search: '',
            setFlag: false,
            noteFlag: false,
            height: 0,
            windowHeight: 0,
            setNoteMapper: {},
            title: '',
            noteSetType: 'public',
            image: 'https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg',
            setColumns: [
                {
                    title: '序号',
                    slot: 'index',
                    width: 75,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'no',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center' 
                }
            ],
            setData: [],
            noteColumns: [
                {
                    title: '编号',
                    key: 'no',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '标题',
                    key: 'title',
                    width: 250,
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 220,
                    align: 'center'
                },
                {
                    renderHeader: (h, params) => {
                        return h('input', {
                                attrs: {
                                    id: 'search',
                                    placeholder: '搜索'
                                },
                                style: {
                                    width: '170px',
                                    border: '1px solid #ccc',
                                    'font-size': '14px',
                                    height: '25px',
                                    'border-radius': '5px'
                                },
                                on: {
                                    input: (e) => {
                                        this.search = e.target.value;
                                    }
                                }
                            })
                    },
                    slot: 'action',
                    align: 'center'
                }
            ],
            noteData: []
        }
    },
    created () {
        
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
    },
    methods: {
        load () {
            var that = this;
            this.axios.get('/api/note/get-notes-outline')
            .then(function (res) {
                console.info(res);
                that.noteData = res.data.noteData;
            })
            .catch(function (error) {
                Message.error(error.response.data.msg);
            })
        },
        addNote (index) {
            var note = {};
            note.no = this.noteData[index].no;
            this.setData.push(note);
            this.setNoteMapper[note.no] = true;
        },
        addGlobalNote () {
            var note = {};
            note.no = this.globalNote.noteNo;
            this.setData.push(note);
            this.setNoteMapper[note.no] = true;
        },
        deleteGlobalNote () {
            for (let i = 0; i < this.setData.length; i++) {
                if (this.setData[i].no === this.globalNote.noteNo) {
                    this.setData.splice(i, 1);
                }
            }
            this.setNoteMapper[this.globalNote.noteNo] = undefined;
        },
        deleteNote (row, index) {
            this.setData.splice(index, 1);
            this.setNoteMapper[row.no] = undefined;
        },
        deleteNoteFromNotes (row) {
            for (let index = 0; index < this.setData.length; index++) {
                if (this.setData[index].no === row.no) {
                    this.setData.splice(index, 1);
                    break;
                }
            }
            this.setNoteMapper[row.no] = undefined;
        },
        getNoteByNoteNo () {
            var that = this;
            this.axios.get("/api/note-set/get-note-by-noteNo?noteNo=" + this.globalNoteNo)
            .then(function (res) {
                that.globalNote = res.data.note;
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
        },
        windowScroll () {
            this.height = window.innerHeight / 2 + document.documentElement.scrollTop;
        },
        createNoteSet () {
            var noteList = [];
            for (let i = 0; i < this.setData.length; i++) {
                noteList.push(this.setData[i].no.toString());
            }
            let data = {
              title: this.title,
              image: this.image,
              noteSetType: this.noteSetType,
              noteList: noteList
            }
            var that = this;
            this.axios({
                url: "/api/note-set/add",
                method: 'post',
                data: data,
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function (res) {
                Message.success({
                    content: "创建成功",
                    duration: 1,
                    onClose: () => {
                        that.$router.push("/notePlate");
                    },
                    closable: true
                })
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
        }
    },
    beforeDestroy () {
 	    window.removeEventListener('scroll', this.windowScroll)
    }
}
</script>