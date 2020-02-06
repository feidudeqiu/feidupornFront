<template>
    <div>
        <div class="head flex-row-center">
            <div class="flex-row-center" style="flex:2;">
                <img src="~static/img/logo.png" />
            </div>
            <div class="flex-row-center" style="flex:4;">
                <input class="search-input" placeholder="搜索" />
                <div
                class="flex-row-center"
                style="width:50px;height:50px;background:lightgray;border-top-right-radius: 5px;border-bottom-right-radius: 5px;"
                >
                <img style="cursor:pointer" class="icon-small" src="~static/img/search.png" />
                </div>
            </div>
            <div style="height:50px;display:flex;flex:2;">
                <div class="mine" style="position:relative;">
                <img id="profilePhoto" class="profilePhoto"  :src="userInfo.icon" />
                <!-- <div>
                    <div>注册</div>
                    <div>登录</div>
                </div> -->
                <div v-if="logged" class="flex-column-inline menu">
                    <div class="text-black text-h4 text-thick">{{userInfo.nickName}}</div>
                    <div class="flex-row-inline menu-item">
                        <img class="menu-icon" src="~static/img/usercenter.png">
                        <div style="flex:1;margin-left:10px;text-align:left">个人中心</div>
                    </div>
                    <div class="flex-row-inline menu-item" @click="logoutConfirm = true">
                        <img class="menu-icon" src="~static/img/logout.png">
                        <div style="flex:1;margin-left:10px;text-align:left">登出</div>
                    </div>
                </div>
                <div v-else class="flex-column-inline menu">
                    <div class="flex-row-inline menu-item" @click="$router.push('/login');">
                        <img class="menu-icon" src="~static/img/login.png">
                        <div style="text-align:left">登录</div>
                    </div>
                    <div class="flex-row-inline menu-item">
                        <img class="menu-icon" src="~static/img/register.png">
                        <div>注册</div>
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
    height: 100px;
    width:100%;
    background-image: url("~static/img/header.jpg");
}
.search-input {
    height:50px;
    padding:0 0 0 20px;
    border:none;
    outline:medium;
    width:400px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.mine {
    height:50px;
}
.profilePhoto {
    width:5opx;
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
    width:25px;
    height:25px;
}
.mine:hover .profilePhoto {
    transform: scale(1.5);
    transition: all 0.3s;
}
.mine:hover .menu{
    display:flex;
}
.menu-item {
    width:100%;
    margin-top:10px;
    padding-bottom: 10px;
    padding-left:10px;
    box-sizing: border-box;
    cursor: pointer;
    border-bottom: 1px solid lightgray;
}
.menu-item:last-child {
    border-bottom: none;
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
            }).catch(function (error) {
                console.info(error);
            })
            that.logged = true;
        }
        this.logged = LoginController.loginControl(success);
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