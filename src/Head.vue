<template>
    <div style="width:100%;" :style="{'min-width': ( minWidth === -1 ? '' : minWidth + 'px' )}">
        <div class="head flex-row-center">
            <div class="flex-row-center" style="flex:2;min-width:150px;">
                <a class="flex-row-center" href="/index" style="height:60px;"><img src="~static/img/logo.png" style="width:100%;max-width:200px;"/></a>
            </div>
            <div class="flex-row-center" style="flex:4;">
                <input class="search-input" placeholder="搜索"  />
                <div
                class="flex-row-center"
                style="width:50px;height:35px;background:lightgray;border-top-right-radius: 5px;border-bottom-right-radius: 5px;"
                >
                <img style="cursor:pointer" class="icon-small" src="~static/img/search.png" />
                </div>
            </div>
            <div style="height:50px;display:flex;justify-content:center;flex:2;min-width:150px;">
                <div class="mine" style="position:relative;margin-left:50px;margin-right:50px;">
                    <img id="profilePhoto" class="profile" :src="userInfo.icon" />
                    <div v-if="logged" class="flex-column-inline menu">
                        <div class="text-black text-h4 text-thick" style="text-align:center;">{{userInfo.nickName}}</div>
                        <div class="menu-item">
                            <a class="flex-row-inline" href="/userCenter" target="_blank">
                                <img class="menu-icon" src="~static/img/usercenter.png">
                                <div class="choice">个人中心</div>
                            </a>
                        </div>
                        <div class="flex-row-inline menu-item" @click="$router.push('/addNote');">
                            <img class="menu-icon" src="~static/img/book.png">
                            <div class="choice">创建文章</div>
                        </div>
                        <div class="flex-row-inline menu-item" @click="$router.push('/notePlate');">
                            <img class="menu-icon" src="~static/img/books.png">
                            <div class="choice">管理文集</div>
                        </div>
                        <div class="flex-row-inline menu-item" @click="$router.push('/pictureBed');">
                            <img class="menu-icon" src="~static/img/pictures.png">
                            <div class="choice">我的图床</div>
                        </div>
                        <div class="flex-row-inline menu-item" @click="$router.push('/userCenter/callback');">
                            <img class="menu-icon" src="~static/img/callback.png">
                            <div class="choice">反馈</div>
                        </div>
                        <div class="flex-row-inline menu-item" @click="logoutConfirm = true;">
                            <img class="menu-icon" src="~static/img/logout.png">
                            <div class="choice">退出</div>
                        </div>
                    </div>
                    <div v-else class="flex-column-inline menu">
                        <div class="flex-row-inline menu-item" @click="$router.push('/login');">
                            <img class="menu-icon" src="~static/img/login.png">
                            <div class="choice">登录</div>
                        </div>
                        <div class="flex-row-inline menu-item"  @click="$router.push('/register');">
                            <img class="menu-icon" src="~static/img/register.png">
                            <div class="choice">注册</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-dialog title="确认退出吗？" v-model="logoutConfirm" :show-cancel-button="true" :beforeClose="beforeClose">
        </van-dialog>
    </div>
</template>
<style scoped>
.head {
    height: 60px;
    width:100%;
    background-image: url("~static/img/header.jpg");
}
.search-input {
    height:35px;
    padding:0 0 0 10px;
    border:none;
    outline:medium;
    width:100%;
    max-width:320px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 14px;
}
.search-input::placeholder {
    font-size: 14px;
}
.mine {
    height:50px;
}
.profile {
    width:50px;
    height:50px;
    border-radius: 50%;
    position: relative;
    z-index:99;
    cursor: pointer;
}
.menu {
    display:none;
    background:white;
    color:#606266;
    width:150px;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    top:25px;
    left:-50px;
    position:absolute;
    z-index:98;
    padding-top:40px;
    border-radius: 3px;
}
.menu-icon {
    width:20px;
    height:20px;
}
.mine:hover .profile {
    transform: scale(1.2);
    transition: all 0.3s;
}
.mine:hover .menu{
    display:flex;
}
.menu-item {
    width:100%;
    padding-top:10px;
    padding-bottom: 10px;
    padding-left:10px;
    box-sizing: border-box;
    cursor: pointer;
}
.menu-item:last-child {
    margin-bottom: 10px;
}
.menu-item:hover {
    background: #f4f4f4;
}
.menu-item .choice {
    flex:1;
    margin-left:10px;
    text-align:left;
    font-size: 14px;
    color: black;
}
</style>
<script>
import { Toast, Dialog } from "vant"
export default {
    name: "Head",
    components: {
        "van-dialog": Dialog.Component
    },
    data () {
        return {
            userInfo: {
                icon: "http://127.0.0.1:8080/global/defaultIcon.png"
            },
            logged: false,
            logoutConfirm: false
        }
    },
    props: {
        minWidth: {
            type: Number,
            default: -1
        }
    },
    created () {
        var that = this;
        this.axios.get('/api/index/get-user-info')
        .then(function (res) {
            that.logged = true;
            that.userInfo = res.data.userInfo;
            if (that.$parent.load) {
                that.$parent.load(res.data);
            }
            if (that.$parent.unsignedLoad) {
                that.$parent.unsignedLoad();
            }
        }).catch(function (err) {
            that.handleErr(err);
            var token = localStorage.getItem("token");
            if (token !== null) {
                that.axios.post("/api/login/login-token", {"token": token})
                .then(function (res) {
                    if (that.$parent.unsignedLoad) {
                        that.$parent.unsignedLoad();
                    }
                    that.axios.get('/api/index/get-user-info')
                    .then(function (res) {
                        that.logged = true;
                        that.userInfo = res.data.userInfo;
                        if (that.$parent.load) {
                            that.$parent.load(res.data);
                        }
                    })
                    .catch(function (err) {
                        that.handleErr(err);
                    })
                })
                .catch(function (err) {
                    if (that.$parent.unsignedLoad) {
                        that.$parent.unsignedLoad();
                    }
                    that.handleErr(err);
                    if (err.response.data.code >= 2) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("tokenTTL");
                    }
                })
            } else {
                if (that.$parent.unsignedLoad) {
                    that.$parent.unsignedLoad();
                }
            }
        })
    },
    methods: {
        logout () {
            var that = this;
            this.axios.get('/api/login/logout')
            .then(function (res) {
                that.logged = false;
                that.userInfo = {icon: "http://127.0.0.1:8080/global/defaultIcon.png"};
                localStorage.removeItem("token");
                localStorage.removeItem("tokenTTL");
                that.$parent.$router.push("/login");
            })
            .catch(function (err) {
                Toast.fail(err.response.data.msg);
            })
        },
        beforeClose (action, done) {
            if (action === "confirm") {
                this.logout();
                done();
            } else {
                done();
            }
        },
        handleErr (err) {
            err = null;
        }
    }
}
</script>