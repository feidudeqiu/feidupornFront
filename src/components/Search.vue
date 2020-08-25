<template>
    <div>
        <div class="head">
            <div class="flex-row-center" style="flex:1;">
                <a href="/index"><img src="~static/img/logo.png"></a>
            </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;margin-top:20px;">
            <Input @on-search="search()" v-model="keyword" search enter-button placeholder="输入关键字" style="width: 300px" />
            <Tabs type="card" style="margin-top:20px;width:800px;">
                <TabPane label="用户" >
                    <div class="flex-row-wrap">
                        <Card :to="'notePlate?username='+user.username" v-for="user in users" :key="user.username" style="margin-left:10px;margin-top:20px;width:250px">
                            <div style="display:flex;flex-direction:row;align-items:center;">
                                <Avatar :src="user.icon" />
                                <div style="margin-left:5px;">
                                    <div>
                                        <span style="color:#17233d;">{{user.username}}</span>
                                    </div>
                                    <div>
                                        <span style="color:#17233d;">{{user.nickname}}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabPane>
                <TabPane label="文章">
                    <List id="list" style="width:100%;" item-layout="vertical">
                        <ListItem v-for="note in notes" style="height:fit-content" :key="note.noteNo">
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
                                <img :src="'https://www.feidudeqiu.xyz/picture/'+note.image" style="width: 280px;height:120px;border-radius:10px;">
                            </template>
                        </ListItem>
                    </List>
                </TabPane>
            </Tabs>
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
</style>
<script>
import {Message, Input, Tabs, TabPane, Card, Avatar, List, ListItem} from "view-design"
export default {
    name: 'Search',
    components: {
        Input,
        Tabs, TabPane,
        Card,
        Avatar,
        List, ListItem
    },
    data () {
        return {
            notes: [],
            users: [],
            keyword: ''
        }
    },
    created () {
        if (this.$route.query.keyword) {
            this.keyword = this.$route.query.keyword;
            this.search();
        }
    },
    methods: {
        search () {
            var that = this;
            var stateObject = {};
            var newUrl = "/search?keyword=" + this.keyword;
            history.pushState(stateObject, null, newUrl);
            this.axios.get("/api/index/search?keyword=" + this.keyword)
            .then(function (res) {
                that.notes = res.data.notes;
                that.users = res.data.users;
            }).catch(function (err) {
                Message.error(err.response.data.msg);
            });
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
            var url = "/note?noteNo=" + noteNo;
            this.$router.push(url);
        }
    }
}
</script>
