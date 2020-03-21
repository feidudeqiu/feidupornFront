<template>
    <div>
        <div class="head">
            <div class="flex-row-center" style="flex:1;">
                <a href="/index"><img src="~static/img/logo.png"></a>
            </div>
        </div>
        <div class="content flex-column-center" style="margin-top:30px;">
            <div style="width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
            <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">重置密码</span>
            </div>
            <div style="width:80%;min-width:230px;max-width:350px;">
                <div class="flex-column-center" style="width:100%;" :style="{display:(step===1?'':'none')}">
                    <div class="input-item">
                        <input maxlength="16" @blur="usernameCheck()" v-model="username" class="input-register input-background-username" placeholder="用户名"/>
                        <div class="span-tip">
                            <span>{{usernameTip}}</span>
                        </div>
                    </div>
                    <div class="input-item">
                        <input type="email" v-model="email" @blur="emailCheck()" class="input-register input-background-email" placeholder="邮箱" />
                        <div class="span-tip">
                        <span>{{emailTip}}</span>
                        </div>
                    </div>
                    <div style="color: #2b85e4;font-size: 12px;width:100%;text-align:right;"><span style="cursor:pointer" @click="step=2">下一步</span></div>
                    <button @click="getCaptcha()" id="bt-getCaptcha" class="flex-row-center" style="border:none;border-radius:5px;width:100%;;height:40px;color:white;margin-top:10px;background: #337ab7;line-height: 2;cursor: pointer;">
                        <span>{{captchaMessage}}</span>
                        <Icon v-if="sending" type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    </button>
                </div>
                <div class="flex-column-center" style="width:100%;" :style="{display:(step===2?'':'none')}">
                    <div  class="input-item">
                        <input type="password" v-model="password" @blur="passwordCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="密码"/>
                        <div class="span-tip">
                            <span>{{passwordTip}}</span>
                        </div>
                    </div>
                    <div  class="input-item">
                        <input type="password" v-model="confirm" @blur="confirmCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="确认密码"/>
                        <span class="span-tip">{{confirmTip}}</span>
                    </div>
                    
                    <div  class="input-item">
                        <input v-model="captcha" maxlength="6"  class="input-register input-background-captcha" placeholder="邮箱验证码"/>
                        <div class="span-tip">
                            <span>{{captchaTip}}</span>
                        </div>
                    </div>
                    <div style="color: #2b85e4;font-size: 12px;width:100%;text-align:left;"><span style="cursor:pointer" @click="step=1">上一步</span></div>
                    <button  @click="resetPassword()" id="bt-register" class="flex-row-center" style="border:none;border-radius:5px;width:100%;height:40px;color:white;margin-top:10px;" :style="{cursor: (register_able?'pointer':'not-allowed'),background:(register_able?'#337ab7':'lightgray')}">
                        <span v-if="register_able">重置密码</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.input-item {
  width:100%;
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
  border: 1px solid #ccc;
  width: 100%;
  font-size: 14px;
  height: 38px;
  box-sizing: border-box;
  padding-left: 42px;
  padding-right: 5px;
  background-repeat: no-repeat;
}
.input-background-username {
  background-image: url("~static/img/username.png");
  background-position-x: 5px;
  background-position-y: 7px;
  background-size: 25px 25px;
}
.input-background-pwd {
  background-image: url("~static/img/password.png");
  background-position-x: 5px;
  background-position-y: 7px;
  background-size: 25px 25px;
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
  margin-right:5px;
  background: #337ab7;
  line-height: 2;
  cursor: pointer;
  box-sizing: border-box;
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
import {Message} from "view-design"
export default {
    name: "ForgetPassword",
    components: {

    },
    data () {
        return {
            step: 1,
            username: '',
            password: '',
            confirm: '',
            email: '',
            captcha: '',
            usernameTip: '',
            passwordTip: '',
            confirmTip: '',
            emailTip: '',
            captchaTip: '',
            usernameCheckFlag: false,
            passwordCheckFlag: false,
            captchaMessage: '获取验证码',
            emailCheckFlag: false,
            count: 60,
            timer: null,
            getCaptcha_able: true,
            register_able: true,
            verifyCodeError: false,
            sending: false
        }
    },
    methods: {
        usernameCheck () {
            if (this.username.length < 1) {
                this.usernameTip = '用户名不为空';
                this.usernameCheckFlag = false;
                return false;
            } else {
                var length = this.username.length;
                for (let i = 0; i < length; i++) {
                    var char = this.username.charCodeAt(i);
                    if (char < 33 || char > 126) {
                        this.usernameTip = '用户名仅为数字，字母和常用符号';
                        this.usernameCheckFlag = false;
                        return false;
                    }
                }
                this.usernameTip = '';
            }
            return true;
        },
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
        emailCheck () {
            if (this.email === '') {
                this.emailTip = '请输入邮箱';
                return false;
            } else {
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                if (!reg.test(this.email)) {
                    this.emailTip = '请输入正确的邮箱地址';
                    return false;
                } else {
                    this.emailTip = '';
                    return true;
                }
            }
        },
        captchaCheck () {
            if (this.captcha.length !== 6) {
                this.captchaTip = '请输入6位验证码';
                return false;
            } else {
                this.captchaTip = '';
                return true;
            }
        },
        getCaptcha () {
            var that = this;
            if (this.getCaptcha_able === false) {
              return;
            }
            if (this.usernameCheck() && this.emailCheck()) {
                that.captchaMessage = "发送中";
                that.getCaptcha_able = false;
                that.sending = true;
                document.getElementById('bt-getCaptcha').style.cursor = 'not-allowed';
                document.getElementById('bt-getCaptcha').style.background = 'gray';
                var data = {
                    username: this.username,
                    email: this.email
                }
                this.axios.post("/api/forget-password/send-mail-captcha", data)
                .then(function (res) {
                    that.sending = false;
                    Message.success({
                        content: "发送成功",
                        closable: true,
                        duration: 3
                    });
                    that.step = 2;
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
            }
        },
        resetPassword () {
            var that = this;
            if (this.passwordCheck() && this.confirmCheck() && this.captchaCheck()) {
                var data = {
                    password: this.password,
                    captcha: this.captcha
                };
                this.axios.post("/api/forget-password/reset-password", data)
                .then(function (res) {
                    Message.success({
                        content: "重置成功",
                        closable: true,
                        duration: 3,
                        onClose: () => {
                            that.$router.push("/login");
                        }
                    });
                })
                .catch(function (err) {
                    Message.error(err.response.data.msg);
                })
            }
        }
    }
}
</script>