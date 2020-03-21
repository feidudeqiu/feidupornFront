<template>
    <div>
        <div class="head">
            <div class="flex-row-center" style="flex:1;">
                <a href="/index"><img src="~static/img/logo.png"></a>
            </div>
        </div>
        <div class="content flex-column-center" style="margin-top:30px;">
            <div style="width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
                <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">登录</span>
            </div>
            <div class="login-item flex-row-center">
                <div class="password-item flex-column-center">
                    <div style="width: fit-content;">
                        <input maxlength="20" class="input-login input-background-username" v-model="identity" placeholder="用户名或邮箱">
                        <input @keyup.enter="login()" type="password" maxlength="16" class="input-login input-background-pwd" style="margin-bottom:10px;" v-model="password" placeholder="密码">
                        <div class="flex-row-center">
                            <div class="flex-row-inline" style="justify-content: space-between;width:100%;">
                                <div class="flex-row-inline" v-if="allowLocalStorage">
                                    <van-checkbox shape="square" checked-color="#2d8cf0" icon-size="12px" v-model="remembered">&thinsp;</van-checkbox>
                                    <div style="color: #2b85e4;font-size: 12px;cursor:pointer" @click="remembered = !remembered" >七天内记住我</div>
                                </div>
                                <div v-else></div>
                                <a href="/forgetPassword"><div style="color: #2b85e4;font-size: 12px;">忘记密码</div></a>
                            </div>
                        </div>
                        <div class="flex-row-center">
                            <div class="flex-row-inline" style="width:100%;justify-content: space-between;margin-top:10px;">
                                <div class="option-button flex-row-center" style="background: #19be6b;cursor:pointer;color:white" @click="login()">登录</div>
                                <div class="option-button flex-row-center" style="background: #2b85e4;cursor:pointer;color:white" @click="register()">注册</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.login-type-selector {
    width: 347px;
    border: 1px solid lightgray;
    height: 40px;
}
.login-item {
    width:80%;
    min-width:230px;
    max-width: 350px;
}
.input-background-username{
    background-image: url("~static/img/username.png");
    background-position-x:5px;
    background-position-y: 7px;
    background-size: 25px 25px;
}
.input-background-pwd{
    background-image: url("~static/img/password.png");
    background-position-x:5px;
    background-position-y: 7px;
    background-size: 25px 25px;
}
.input-login{
    border:1px solid #ccc;
    width:100%;
    font-size:14px;
    height:38px;
    padding-left:42px;
    padding-right: 5px;
    margin-bottom: 20px;
    background-repeat: no-repeat;
    box-sizing: border-box;
}
.scan-item {
    width:300px;
    height:300px;
}
.password-item {
    width: 100%;
    height: fit-content;
}
.option-button {
    width:150px;
    height:30px;
    border-radius: 5px;
    font-weight: 800;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>
<script>
import {Checkbox} from "vant"
import {Spin, Message, Icon} from "view-design"
import Vue from 'vue'
Vue.component('Icon', Icon);
export default {
    name: 'Login',
    components: {
        "van-checkbox": Checkbox,
        Spin,
        Icon
    },
    data () {
        return {
            allowLocalStorage: false,
            identity: '',
            password: '',
            remembered: false
        }
    },
    created () {
        if (localStorage !== null) {
            this.allowLocalStorage = true;
        } else {
            this.allowLocalStorage = false;
        }
    },
    methods: {
        login () {
            var that = this;
            let data = {
                identity: this.identity,
                password: this.password,
                remembered: this.remembered
            }
            Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 18
                                }
                            }),
                            h('div', '登陆中')
                        ])
                    }
                });
            this.axios
                .post("/api/login/login-post", data)
                .then(function (res) {
                    Spin.hide();
                    if (that.remembered) {
                        var storage = window.localStorage;
                        if (storage !== undefined) {
                            storage.setItem("token", res.data.token);
                            storage.setItem("tokenTTL", res.data.tokenTTL);
                        }
                    }
                    sessionStorage.setItem("logged", true);
                    that.$router.replace("/index");
                })
                .catch(function (err) {
                    Spin.hide();
                    Message.error(err.response.data.msg);
                })
        },
        register () {
            this.$router.push("/register");
        }
    }
}
</script>
