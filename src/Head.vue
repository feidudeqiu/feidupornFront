<template>
    <div style="width:100%;">
        <div class="head flex-row-center">
            <div class="flex-row-center" style="flex:2;">
                <img src="~static/img/logo.png" @click="$router.push('/index')" style="cursor:pointer"/>
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
            <div style="height:50px;display:flex;flex:2;">
                <div class="mine" style="position:relative;">
                <a :href="logged?'/userCenter':'/login'" target="_blank">
                    <img id="profilePhoto" class="profile" :src="userInfo.icon" />
                </a>
                <div v-if="logged" class="flex-column-inline menu">
                    <div class="text-black text-h4 text-thick">{{userInfo.nickName}}</div>
                    <div class="menu-item">
                        <a class="flex-row-inline" href="/userCenter" target="_blank">
                            <img class="menu-icon" src="~static/img/usercenter.png">
                            <div class="choice">个人中心</div>
                        </a>
                    </div>
                    <div class="flex-row-inline menu-item" @click="logoutConfirm = true">
                        <img class="menu-icon" src="~static/img/message.png">
                        <div class="choice">我的消息</div>
                    </div>
                    <div class="flex-row-inline menu-item" @click="logoutConfirm = true">
                        <img class="menu-icon" src="~static/img/logout.png">
                        <div class="choice">登出</div>
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
    height: 75px;
    width:100%;
    background-image: url("~static/img/header.jpg");
}
.search-input {
    height:35px;
    padding:0 0 0 20px;
    border:none;
    outline:medium;
    width:320px;
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
    transform: scale(1.5);
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
import {LoginController} from "@/assets/js/common.js"
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
    created () {
        var that = this;
        function success () {
            that.axios.get('/api/index/get-user-info').then(function (res) {
                that.userInfo = res.data.userInfo;
                sessionStorage.setItem("logged", true);
                that.logged = true;
            }).catch(function (error) {
                that.logged = false;
                sessionStorage.setItem("logged", false);
                console.info(error);
            })
        }
        that.logged = LoginController.loginControl(success);
    },
    methods: {
        logout () {
            var that = this;
            this.axios.post('/api/login/logout')
            .then(function (res) {
                that.logged = false;
                that.userInfo = {icon: "http://127.0.0.1:8080/global/defaultIcon.png"};
                sessionStorage.setItem("logged", false);
                localStorage.removeItem("token");
                localStorage.removeItem("tokenTTL");
                that.$router.push("/index");
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
        }
    }
}
</script>