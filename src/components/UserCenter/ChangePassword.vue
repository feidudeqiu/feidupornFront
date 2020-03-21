<template>
    <div style="min-width:1000px;">
        <porn-head>
        </porn-head>
        <div style="width:100%;margin-top:50px;margin-bottom:50px;" class="flex-row-center">
            <div style="display:flex;flex-direction:row;height:450px;position: relative;box-shadow:0 2px 5px 0 rgba(0,0,0,.1);">
                <usercenter-menu style="height:100%;position: absolute;top:0;left:0;"></usercenter-menu>
                <div class="content">
                    <div class="content-head">
                        <div style="width:4px;height:21px;background:#00A1D7;border-radius:4px;"></div>
                        <span style="padding-left:10px;color:#17233d;font-size:15px;">安全中心 / 修改密码</span>
                    </div>
                    <div class="content-body">
                        <div class="input-item" style="margin-top:50px;">
                            <input type="password" v-model="password" @blur="passwordCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="密码"/>
                            <div class="span-tip">
                            <span>{{passwordTip}}</span>
                            </div>
                        </div>
                        <div class="input-item">
                            <input type="password" v-model="confirm" @blur="confirmCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="确认密码"/>
                            <span class="span-tip">{{confirmTip}}</span>
                        </div>
                        <div class="input-item" style="position:relative">
                            <input v-model="captcha" style="position:relative" maxlength="6" class="input-register input-background-captcha" placeholder="邮箱验证码"/>
                            <div class="button-captcha flex-row-center"  id="bt-getCaptcha" @click="sendCaptcha()">
                            <span >{{captchaMessage}}</span>
                            <Icon v-if="sending" type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            </div>
                        </div>
                        <button @click="change()" id="bt-register" class="flex-row-center" style="border:none;border-radius:5px;width:50%;;height:30px;color:white;margin-top:10px;" :style="{cursor: (register_able?'pointer':'not-allowed'),background:(register_able?'#337ab7':'lightgray')}">
                            <span v-if="register_able">修改密码</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.content {
    width:800px;
    border-top:1px solid lightgray;
    border-left:1px solid lightgray;
    border-right:1px solid lightgray;
    border-bottom:1px solid lightgray;
    box-sizing: border-box;
    margin-left:150px;
}
.content-head {
    height:50px;
    border-bottom:1px solid lightgray;
    font-size:16px;
    display:flex;
    flex-direction: row;
    align-items: center;
    padding-left:30px;
    box-sizing: border-box;
}
.content-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.input-item {
  width:800px;
}
.span-tip {
  margin-top:5px;
  margin-bottom: 5px;
  width:100%;
  min-height:20px;
  font-size: 14px;
  color: #a94442;
  display:flex;
  flex-direction: row;
  justify-content: center;
}
.input-register {
  border:none;
  border-bottom: 1px solid #ccc;
  width: 50%;
  font-size: 14px;
  height: 38px;
  box-sizing: border-box;
  padding-left: 42px;
  padding-right: 5px;
  background-repeat: no-repeat;
}
.input-background-pwd {
  background-image: url("~static/img/password.png");
  background-position-x: 5px;
  background-position-y: 7px;
  background-size: 25px 25px;
}
.button-captcha {
  width: 100px;
  height: 30px;
  display: block;
  position: absolute;
  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
  color: white;
  margin-top:4px;
  top:0px;
  left:495px;
  margin-right:5px;
  background: #337ab7;
  line-height: 2;
  cursor: pointer;
  box-sizing: border-box;
}
.input-background-email {
  background-image: url("~static/img/email.png");
  background-position-x: 5px;
  background-position-y: 7px;
  background-size: 25px 25px;
}
.input-background-captcha {
  background-image: url("~static/img/captcha.png");
  background-position-x: 5px;
  background-position-y: 7px;
  background-size: 25px 25px;
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
import Head from "@/Head.vue"
import Menu from "@/components/UserCenter/Menu.vue"
import {Message, Modal, Icon} from "view-design"
export default {
    name: "ChangePassword",
    components: {
        "porn-head": Head,
        "usercenter-menu": Menu,
        Modal,
        Icon
    },
    data () {
        return {
            password: '',
            confirm: '',
            register_able: true,
            passwordTip: '',
            confirmTip: '',
            captcha: '',
            captchaMessage: '获取验证码',
            count: 60,
            sending: false
        }
    },
    methods: {
        passwordCheck () {
            if (this.password.length < 8) {
                this.passwordTip = '密码长度应不小于8位';
                this.passwordCheckFlag = false;
                return false;
            } else {
                var lenght = this.password.length;
                for (let i = 0; i < length; i++) {
                    var char = this.password.charCodeAt(i);
                    if (char < 33 || char > 126) {
                        this.passwordTip = '密码仅为数字，字母和常用符号';
                        this.passwordCheckFlag = false;
                        return false;
                    }
                }
                this.passwordTip = '';
                this.passwordCheckFlag = true;
            }
            if (this.confirm !== '') {
                this.confirmCheck();
            }
            return true;
        },
        confirmCheck () {
            if (this.password !== this.confirm) {
                this.confirmTip = '两次密码输入不一致';
                return false;
            } else {
                this.confirmTip = '';
                return true;
            }
        },
        sendCaptcha () {
            var that = this;
            if (this.getCaptcha_able === false) {
              return;
            }
            that.captchaMessage = "发送中";
            that.getCaptcha_able = false;
            that.sending = true;
            document.getElementById('bt-getCaptcha').style.cursor = 'not-allowed';
            document.getElementById('bt-getCaptcha').style.background = 'gray';
            this.axios.get("/api/user-center/security/changePassword/send-mail-captcha")
            .then(function (res) {
                that.sending = false;
                Message.success({
                    content: "发送成功",
                    closable: true,
                    duration: 3
                });
                that.timer = setInterval(() => {
                    if (that.count > 0 && that.count <= 60) {
                    that.captchaMessage = that.count-- + "s后再次获取";
                    } else {
                    clearInterval(that.timer);
                    that.timer = null;
                    that.count = 60;
                    that.captchaMessage = "获取验证码";
                    document.getElementById('bt-getCaptcha').style.cursor = 'pointer'
                    document.getElementById('bt-getCaptcha').style.background = '#337ab7';
                    that.getCaptcha_able = true;
                    }
                }, 1000)
            })
            .catch(function (err) {
                that.sending = false;
                Message.error(err.response.data.msg);
                document.getElementById('bt-getCaptcha').style.cursor = 'pointer'
                document.getElementById('bt-getCaptcha').style.background = '#337ab7';
                that.getCaptcha_able = true;
            });
        },
        change () {
            var data = {
                password: this.password,
                verifyCode: this.captcha
            };
            if (this.register_able === false) {
                return;
            }
            this.register_able = false;
            var that = this;
            this.axios
            .post("/api/user-center/security/changePassword", data)
            .then(function (res) {
                Message.success({
                    content: "修改成功",
                    closable: true,
                    duration: 3,
                    onClose: () => {
                        that.$router.push("/login");
                    }
                });
            })
            .catch(function (err) {
                that.register_able = true;
                Message.error(err.response.data.msg);
            })
        }
    }
}
</script>