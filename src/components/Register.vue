<template>
  <div style="width:100%;">
    <div class="head">
      <div class="flex-row-center" style="flex:1;">
        <img src="~static/img/logo.png" />
      </div>
    </div>
    <div class="content">
      <div class="flex-column-center" style="margin-top:30px;">
        <div style="width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
          <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">注册</span>
        </div>
        <div class="flex-column-center" style="width:80%;min-width:230px;max-width:350px;">
          <div class="input-item">
            <input maxlength="16" @blur="usernameCheck()" v-model="username" class="input-register input-background-username" placeholder="用户名"/>
            <div class="span-tip">
              <span>{{usernameTip}}</span>
            </div>
          </div>
          <div class="input-item">
            <input type="password" v-model="password" @blur="passwordCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="密码"/>
            <div class="span-tip">
              <span>{{passwordTip}}</span>
            </div>
          </div>
          <div class="input-item">
            <input type="password" v-model="confirm" @blur="confirmCheck()" maxlength="15" class="input-register input-background-pwd" placeholder="确认密码"/>
            <span class="span-tip">{{confirmTip}}</span>
          </div>
          <div class="input-item">
            <input type="email" v-model="email" @blur="emailCheck()" class="input-register input-background-email" placeholder="邮箱" />
            <div class="span-tip">
              <span>{{emailTip}}</span>
            </div>
          </div>
          <div style="display:flex;width:100%;justify-content: flex-end;">
            <input v-model="captcha" style="position:relative" maxlength="6" class="input-register input-background-captcha" placeholder="邮箱验证码"/>
            <div class="button-captcha flex-row-center"  id="bt-getCaptcha" @click="sendCaptcha()">
              <span >{{captchaMessage}}</span>
            </div>
          </div>
          <button @click="register()" id="bt-register" class="flex-row-center" style="border:none;border-radius:5px;width:100%;;height:40px;color:white;margin-top:10px;" :style="{cursor: (register_able?'pointer':'not-allowed'),background:(register_able?'#337ab7':'lightgray')}">
            <span v-if="register_able">注册</span>
            <van-loading type="spinner" color="gray" v-else />
          </button>
          <div class="flex-row-inline" style="justify-content: flex-end;width:100%;margin-top:10px;" @click="login()">
            <span style="color:#337ab7;font-size: 12px;cursor: pointer" >已有账号，直接登录></span>
          </div>
          <van-dialog title="验证码检验" v-model="isShow" :show-cancel-button="true" :beforeClose="beforeClose">
            <img :src="imgUrl" @click="refreshCode()" style="margin-top:20px;width:70px;height:30px">
            <span style="display:block;font-size: 12px;color: #a94442" v-if="verifyCodeError" >验证码错误或邮箱已被使用</span>
            <van-field v-model="verifyCode" placeholder="请输入验证码"/>
          </van-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Dialog, Field, Toast, Loading} from 'vant'
export default {
    name: "Register",
    components: {
      "van-dialog": Dialog.Component,
      "van-field": Field,
      "van-loading": Loading
    },
    data () {
        return {
            username: '',
            password: '',
            confirm: '',
            email: '',
            captcha: '',
            usernameTip: '',
            passwordTip: '',
            confirmTip: '',
            emailTip: '',
            usernameCheckFlag: false,
            passwordCheckFlag: false,
            captchaMessage: '获取验证码',
            imgUrl: '',
            isShow: false,
            verifyCode: '',
            emailCheckFlag: false,
            count: 60,
            timer: null,
            getCaptcha_able: true,
            register_able: true,
            verifyCodeError: false
            };
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
            var that = this;
            var useful = false;
            this.axios
                .post("/api/register/check-username?username=" + that.username)
                .then(function (res) {
                    console.info(res.data);
                    useful = res.data;
                    if (!useful) {
                        that.usernameTip = '用户名已存在';
                        that.usernameCheckFlag = false;
                        return 0;
                    }
                    that.usernameTip = '';
                    that.usernameCheckFlag = true;
                })
                .catch(function (error) {
                    console.info(error);
                    that.usernameTip = '联机出错';
                    that.usernameCheckFlag = false;
                });
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
        sendCaptcha () {
            if (this.getCaptcha_able === false) {
              return;
            }
            var that = this;
            if (this.email === '') {
                this.emailTip = '请输入邮箱';
            } else {
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                if (!reg.test(this.email)) {
                    this.emailTip = '请输入正确的邮箱地址';
                } else {
                    var num = Math.ceil(Math.random() * 1000);
                    this.imgUrl = 'api/register/get-verify-code' + "?" + num;
                    this.isShow = true;
                }
            }
        },
        refreshCode () {
            var num = Math.ceil(Math.random() * 1000);
            this.imgUrl = 'api/register/get-verify-code' + "?" + num;
            this.verifyCodeError = false;
        },
        beforeClose (action, done) {
          var that = this;
          if (action === "confirm") {
            this.axios
            .post("/api/register/send-mail-captcha?email=" + that.email + "&verifyCode=" + that.verifyCode)
            .then(function (res) {
              if (res.data === true) {
                done();
                that.verifyCode = '';
                document.getElementById('bt-getCaptcha').style.cursor = 'not-allowed';
                document.getElementById('bt-getCaptcha').style.background = 'gray';
                that.getCaptcha_able = false;
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
                that.verifyCodeError = false;
              } else {
                that.verifyCode = '';
                that.verifyCodeError = true;
                done(false);
              }
            })
            .catch(function (error) {
              that.verifyCodeError = true;
              done(false);
              console.info(error);
            });
          } else {
            this.verifyCodeError = false;
            this.verifyCode = '';
            done();
          }
        },
        register () {
          var that = this;
          if (this.usernameCheck() && this.passwordCheck() && this.confirmCheck() && this.emailCheck() && this.captcha !== "") {
            let data = {
              username: this.username,
              password: this.password,
              email: this.email,
              authCode: this.captcha
            }
            this.register_able = false;
            this.axios
            .post("/api/register/register-post", data)
            .then(function (res) {
              that.register_able = true;
              Toast.success('注册成功');
              setTimeout(function () {
                that.$router.replace("/login");
              }, 1000);
            })
            .catch(function (error) {
              Toast.fail(error.response.data.msg);
              that.register_able = true;
            });
          }
        },
        login () {
          this.$router.push("/login");
        }
    }
  }
</script>
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
</style>