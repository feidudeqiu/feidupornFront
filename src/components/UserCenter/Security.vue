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
                        <span style="padding-left:10px;color:#17233d;font-size:15px;">安全中心</span>
                    </div>
                    <div class="content-body">
                        <div class="flex-row-inline content-item">
                            <div class="flex-row-center" style="flex:2;">
                                <img class="icon" src="~static/img/success.png">
                                <div style="margin-left:5px;color:#17233d;font-size:14px;">设置密码</div>
                            </div>
                            <div style="flex:2;margin-left:5px;color:#515a6e;font-size:12px;">已设置</div>
                            <div style="flex:2;">
                                <button style="cursor:pointer;flex:2;border:none;width:100px;height:25px;background:#48bd86;color:white;border-radius:5px;"
                                    @click="$router.push('/userCenter/security/changePassword')"
                                >修改密码</button>
                            </div>
                        </div>
                        <div class="flex-row-inline content-item">
                            <div class="flex-row-center" style="flex:2;">
                                <img class="icon" src="~static/img/success.png">
                                <div style="margin-left:5px;color:#17233d;font-size:14px;">绑定邮箱</div>
                            </div>
                            <div style="flex:2;margin-left:5px;color:#515a6e;font-size:12px;">{{userInfo.email}}</div>
                            <div style="flex:2;">
                                <button style="cursor:pointer;flex:2;border:none;width:100px;height:25px;background:#48bd86;color:white;border-radius:5px;"
                                    @click="changeMail()"
                                >更换邮箱</button>
                            </div>
                        </div>
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
.content-item {
    height: 75px;
    width:90%;
    margin-bottom:10px;
    padding-bottom:10px;
    border-bottom:1px solid lightgray;
}
.content-item:last-child {
    border-bottom:none;
}
.icon {
    width:20px;
    height:20px;
}
</style>
<script>
import Head from "@/Head.vue"
import Menu from "@/components/UserCenter/Menu.vue"
import {Message} from "view-design"
export default {
    name: "Security",
    components: {
        "porn-head": Head,
        "usercenter-menu": Menu
    },
    data () {
        return {
            userInfo: {

            }
        }
    },
    methods: {
        changeMail () {
            Message.info({
                content: "本站暂未开放,实现绑定手机功能后可以修改邮箱",
                duration: 5,
                closable: true
            })
        },
        load () {
            var that = this;
            this.axios.get('/api/user-center/security')
            .then(function (res) {
                that.userInfo = res.data;
            })
            .catch(function (error) {
                console.info(error);
            })
        }
    }
}
</script>