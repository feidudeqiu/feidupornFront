<template>
    <div style="min-height:625px;min-width:700px;height:100%;width:100%;" class="flex-column-inline">
        <porn-head :minWidth=700></porn-head>
        <div style="flex:1;" >
            <Drawer :mask="true" :closable="false" @on-close="drawerFlag = false" :scrollable="true" :width="250" placement="left" v-model="drawerFlag">
                <div slot="header" class="flex-row-inline">
                    <img src="~static/img/books.png" style="width:20px;height:20px;">
                    <span>文集</span>
                    <Icon style="margin-left:100px;cursor:pointer" @click="eye=!eye;" :type="eye?'ios-eye':'ios-eye-off'" size="32" color="#8a8a8a" />
                    <a v-if="username===userInfo.userName"  href="addNoteSet" target="_blank"><img src="~static/img/add-round.png" style="cursor:pointer;width:20px;height:20px;margin-left:10px;"></a>
                </div>
                <div @click="getAllNotesInfo()" class="note-item flex-row-center" :style="{'border-left':setNo == 0 ?'10px solid #19be6b':'none'}" style="margin-bottom:10px;background-repeat:no-repeat;background-size:cover;background-position:center;background-image:url('https://tva1.sinaimg.cn/large/6f8a2832gy1g6s9wfpverj22yo1og7wh.jpg')">
                    <span style="color: white;font-size: 14px;">全部(默认)</span>
                </div>
                <div v-for="noteSet in noteSetList" v-bind:key="noteSet.setNo" style="margin-bottom:10px;" >
                    <div @click="getNotesInfoBySetNo(noteSet.setNo)"  class="note-item flex-row-center" style="background-repeat:no-repeat;background-size:cover;background-position:center" :style="{'background-image': 'url('+noteSet.image+')','border-left':(setNo == noteSet.setNo ?'10px solid #19be6b':'none')}">
                        <span style="color: white;font-size: 14px;">{{noteSet.title}}</span>
                            <div class="flex-row-inline" style="position:absolute;top:10px;left:10px;"><img style="width:16px;height:16px;" src="~static/img/star.png"><span style="margin-left:10px;color:rgb(255,152,1);font-weight:600;line-height:1.2;">0</span></div>
                            <div v-if="noteSet.userImage" style="position:absolute;top:2px;left:170px;" @click.stop="$router.push('notePlate?username='+noteSet.username);"><img style="width:32px;height:32px;border-radius:50%;border:1px solid white" :src=noteSet.userImage></div>
                    </div>
                    <div v-if="eye" style="margin-top:2px;" class="flex-row-inline" >
                        <span style="font-weight:600;flex:1;">操作:</span>
                        <div style="flex:2;" >
                            <Button v-if="noteSet.username==username" type="info" size="small" @click="$router.push({path: 'editNoteSet', query: {noteSetNo: noteSet.setNo}})">编辑</Button>
                            <Button v-if="noteSet.username==username" type="error" size="small" @click="removeNoteSet(noteSet.setNo,!noteSet.userImage)">删除</Button>
                            <Button v-if="noteSet.username!=username" type="info" size="small" @click="collect()">收藏</Button>
                        </div>
                    </div>
                </div>
            </Drawer>
            <div class="flex-row-center">
                <div style="width:650px;margin-bottom:20px;">
                    <List id="list" style="width:100%;" item-layout="vertical">
                        <ListItem v-for="note in noteData" style="height:fit-content" :key="note.noteNo">
                            <div style="display:flex;flex-direction:column;height:100%;">
                                <div class="flex-row-inline" style="width:fit-content;" >
                                    <div class="flex-row-inline" style="cursor:pointer;" @click="$router.push('notePlate?username='+note.userName);">
                                        <img :src="note.icon" style="width:32px;height:32px;border-radius:50%;">
                                        <div style="margin-left:10px;font-size:16px;" class="text-middle">{{note.nickName}}</div>
                                    </div>
                                    <div style="margin-left:10px;font-size:12px;font-weight:700;">{{dateFormat(note.createTime)}}</div>
                                </div>
                                <div style="margin-left:42px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                                    <div style="cursor:pointer" @click="gotoNote(note.noteNo)">
                                        <div style="color:#17233d;font-weight:600">{{note.title}}</div>
                                        <div style="color:#515a6e">&emsp;&emsp;{{note.breif}}</div>
                                    </div>
                                    <div class="flex-row-inline" style="margin-top: 16px;margin-left:10px;">
                                        <li style="padding: 0 16px;border-right:1px solid lightgray;cursor:pointer" @click="star()">
                                            <Icon size="20" type="ios-star-outline" /> 0
                                        </li>
                                        <li style="padding: 0 16px;border-right:1px solid lightgray;cursor:pointer" @click="thumbUp()">
                                            <Icon size="20" type="ios-thumbs-up-outline" /> 0
                                        </li>
                                        <li style="padding: 0 16px;cursor:pointer" @click="chat()">
                                            <Icon size="20" type="ios-chatbubbles-outline" /> 0
                                        </li>
                                    </div>
                                </div>
                            </div>
                            <template slot="extra" v-if="note.image">
                                <img :src="note.image" style="width: 280px;height:120px;border-radius:10px;">
                            </template>
                        </ListItem>
                    </List>
                    <Skeleton style="margin-top:20px;" v-if="!end" :animate="loading" id="loading" :row-width="rowWidth" title avatar :row="row" loading="loading"/>
                    <div v-if="end">到底啦！</div>
                    <img v-if="!drawerFlag" style="position:absolute;left:0;cursor: pointer;width:30px;height:30px;" src="~static/img/right-arrow.png" :style="{'top': height + 'px'}" @click="drawerFlag = true"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.note-item {
    display: flex;
    flex-direction: column;
    width:220px;
    height:110px;
    border-radius: 5px;
    cursor: pointer;
    position:relative;
}
div {
    text-align:left;
}
>>>div::-webkit-scrollbar {
		width: 0px; height: 0px;
}
>>>.van-skeleton {
    padding:0;
}
>>>.van-skeleton__avatar {
    margin:0 5px 0 0;
}
img {
    object-fit: cover;
}
</style>
<script>
import Head from "@/Head.vue"
import {List, ListItem, ListItemMeta, Drawer, Scroll, Message, Icon, Button, Modal} from "view-design"
import { Skeleton } from 'vant'
export default {
    name: "NotePlate",
    components: {
        "porn-head": Head,
        List, ListItem, ListItemMeta,
        Drawer,
        Scroll,
        Message,
        Skeleton,
        Icon, Button
    },
    data () {
        return {
            eye: false,
            row: 3,
            rowWidth: ['600px', '600px', '240px'],
            drawerFlag: false,
            loading: false,
            height: 0,
            windowHeight: 0,
            page: 1,
            end: false,
            noteSetList: [],
            noteData: [],
            setNo: 0,
            allNoteData: null,
            username: '',
            userInfo: [],
            init: false
        }
    },
    mounted () {
        var that = this;
        this.loading = true;
        this.loadingShow();
        this.windowScroll();
        that.windowHeight = window.innerHeight;
        window.addEventListener('scroll', this.windowScroll);
        window.onresize = function () {
            that.windowScroll();
            that.windowHeight = window.innerHeight;
        }
    },
    methods: {
        getAllNotesInfo () {
            var that = this;
            this.page = 1;
            this.end = false;
            this.setNo = 0;
            that.loading = true;
            that.noteData = [];
            var url = '';
            if (this.$route.query.username) {
                url = "/api/note-set/get-all-notes-info?username=" + this.$route.query.username;
            } else {
                url = "/api/note-set/get-all-notes-info?username=" + this.username;
            }
            this.axios.get(url)
            .then(function (res) {
                that.loading = false;
                that.allNoteData = res.data.notes;
                for (let i = 0; i < res.data.notes.length; i++) {
                    that.checkImage(res.data.notes[i], res.data.imagePrefix);
                }
                that.userInfo = res.data.userInfo;
                that.noteData = [];
                var end = 0;
                that.page = 1;
                if (that.allNoteData.length >= that.page * 10) {
                    end = that.page * 10;
                } else if (that.allNoteData.length > (that.page - 1) * 10) {
                    end = that.allNoteData.length;
                    that.end = true;
                } else {
                    that.end = true;
                }
                for (let i = (that.page - 1) * 10; i < end; i++) {
                    that.allNoteData[i].icon = that.userInfo.icon;
                    that.allNoteData[i].nickName = that.userInfo.nickName;
                    that.allNoteData[i].userName = that.userInfo.userName;
                    that.noteData.push(that.allNoteData[i]);
                }
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
        },
        removeNoteSet (noteSetNo, isOwner) {
            var that = this;
            var data = {
                setNo: noteSetNo,
                isOwner: isOwner
            };
            if (isOwner) {
                Modal.confirm({
                    title: '删除文集',
                    content: '<p>将删除您所创建的文集，但不会删除其中收录的文章</p>',
                    onOk: () => {
                        that.axios.post("/api/note-set/remove-note-set", data)
                        .then(function (res) {
                            Message.success(res.data.msg);
                            if (that.setNo === noteSetNo) {
                                that.getAllNotesInfo();
                            }
                            for (let i = 0; i < that.noteSetList.length; i++) {
                                if (that.noteSetList[i].setNo === noteSetNo) {
                                    that.noteSetList.splice(i, 1);
                                    break;
                                }
                            }
                        })
                        .catch(function (err) {
                            Message.error(err.response.data.msg);
                        })
                    },
                    onCancel: () => {
                         
                    }
                });
            } else {
                Modal.confirm({
                    title: '删除文集',
                    content: '<p>将删除您所收藏的文集</p>',
                    onOk: () => {
                        that.axios.post("/api/note-set/remove-note-set", data)
                        .then(function (res) {
                            Message.success(res.data.msg);
                        })
                        .catch(function (err) {
                            Message.error(err.response.data.msg);
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
            }
        },
        load (data) {
            var that = this;
            var url = '';
            this.username = data.userInfo.userName;
            if (this.$route.query.username) {
                url = "/api/note-set/get?username=" + this.$route.query.username;
            } else {
                url = "/api/note-set/get?username=" + data.userInfo.userName;
            }
            this.getAllNotesInfo();
            this.axios.get(url)
            .then(function (res) {
                that.noteSetList = res.data.noteSetList;
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
            this.init = true;
        },
        unsignedLoad () {
            var that = this;
            if (this.init === false) {
                var url = "/api/note-set/get?username=" + this.$route.query.username;
                this.getAllNotesInfo();
                this.axios.get(url)
                .then(function (res) {
                    that.noteSetList = res.data.noteSetList;
                })
                .catch(function (err) {
                    Message.error(err.response.data.msg);
                })
            }
        },
        getNotesInfoBySetNo (setNo) {
            var that = this;
            this.page = 1;
            this.end = false;
            this.setNo = setNo;
            that.loading = true;
            that.noteData = [];
            var url = "/api/note-set/get-notes-info?" + "setNo=" + setNo + "&page=" + this.page; 
            this.axios.get(url)
            .then(function (res) {
                that.loading = false;
                that.noteData = res.data.noteList;
                for (let i = 0; i < res.data.noteList.length; i++) {
                    that.checkImage(res.data.noteList[i], res.data.imagePrefix);
                }
                if (!res.data.noteList || res.data.noteList.length !== 10) {
                    that.end = true;
                }
            })
            .catch(function (err) {
                that.loading = false;
                Message.error(err.response.data.msg);
            })
        },
        handleReachBottom () {
            Message.info("reach bottom");
        },
        windowScroll () {
            this.height = window.innerHeight / 2 + document.documentElement.scrollTop;
        },
        collect () {
            Message.info("暂未开启收藏功能！");
        },
        loadingShow () {
            var that = this;
            window.onscroll = function (e) {
                if (window.innerHeight + document.documentElement.scrollTop > document.getElementById("loading").offsetTop + 116) {
                    if (that.loading === false && that.end === false) {
                        that.loading = true;
                        if (that.setNo !== 0) {
                            var url = "/api/note-set/get-notes-info?" + "setNo=" + that.setNo + "&page=" + ++that.page; 
                            that.axios.get(url)
                            .then(function (res) {
                                that.loading = false;
                                if (res.data.noteList.length !== 10 || !res.data) {
                                    console.info("end is true");
                                    that.end = true;
                                }
                                for (let i = 0; i < res.data.noteList.length; i++) {
                                    that.checkImage(res.data.noteList[i], res.data.imagePrefix);
                                }
                                for (let i = 0; i < res.data.noteList.length; i++) {
                                    that.noteData.push(res.data.noteList[i]);
                                }
                            })
                            .catch(function (err) {
                                Message.error(err.response.data.msg);
                            })
                        } else {
                            let end = 0;
                            that.page++;
                            if (that.allNoteData.length >= that.page * 10) {
                                end = that.page * 10;
                            } else if (that.allNoteData.length > (that.page - 1) * 10) {
                                end = that.allNoteData.length;
                                that.end = true;
                            } else {
                                that.end = true;
                            }
                            for (let i = (that.page - 1) * 10; i < end; i++) {
                                that.allNoteData[i].icon = that.userInfo.icon;
                                that.allNoteData[i].nickName = that.userInfo.nickName;
                                that.allNoteData[i].userName = that.userInfo.userName;
                                that.noteData.push(that.allNoteData[i]);
                            }
                            that.loading = false;
                        }
                    }
                }
            }
        },
        checkImage (note, prefix) {
            if (note.image !== null) {
                if (note.image.split('/').length === 1) {
                    note.image = prefix + note.image;
                }
            }
        },
        star () {
            Message.error("暂未开启收藏功能");
        },
        thumbUp () {
            Message.error("暂未开启点赞功能");
        },
        chat () {
            Message.error("暂未开启评论功能");
        },
        dateFormat (timestamp) {
            var time = new Date(timestamp)
            var year = time.getFullYear(),
                month = time.getMonth() + 1,
                day = time.getDate(),
                hour = time.getHours(),
                minute = time.getMinutes(),
                second = time.getSeconds()
            var add0 = function (m) {
                return m < 10 ? '0' + m : m
            }
            return  year + '-' + add0(month) + '-' + add0(day) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second);
        },
        gotoNote (noteNo) {
            var url = "/noteSet?";
            url += "noteSetNo=" + this.setNo;
            if (this.setNo === 0) {
                url += "&username=" + this.userInfo.userName;
            }
            url += "&noteNo=" + noteNo;
            this.$router.push(url);
        }
        
    }
}
</script>