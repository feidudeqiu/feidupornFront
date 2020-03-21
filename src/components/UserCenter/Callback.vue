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
                        <span style="padding-left:10px;color:#17233d;font-size:15px;">反馈</span>
                    </div>
                    <div class="content-body">
                        <Input v-model="title" maxlength="50" show-word-limit placeholder="标题" style="width: 700px;margin-top:20px;" />
                        <Input v-model="content" :autosize="{minRows: 10}" maxlength="500" show-word-limit type="textarea" placeholder="内容" style="width: 700px;margin-top:20px;" />
                        <div style="padding:10px;display:flex;box-sizing:border-size;width:700px;justify-content:space-between;">
                            <div>
                                <Icon color="#808695" type="md-information-circle" /><span style="color:#808695">感谢您宝贵的意见，站长将努力改进</span>
                            </div>
                            <Button :loading="sending" @click="sendCallback()" type="primary">发送</Button>
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
</style>
<script>
import Head from "@/Head.vue"
import Menu from "@/components/UserCenter/Menu.vue"
import {Message, Modal, Input, Button, Icon} from "view-design"
export default {
    name: "Callback",
    components: {
        "porn-head": Head,
        "usercenter-menu": Menu,
        Input,
        Button
    },
    data () {
        return {
            title: '',
            content: '',
            sending: false
        }
    },
    mounted () {

    },
    methods: {
        sendCallback () {
            var that = this;
            if (this.title === '') {
                Message.error("请输入标题");
                return false;
            }
            if (this.content === '') {
                Message.error("请输入内容");
                return false;
            }
            var data = {
                title: this.title,
                content: this.content
            }
            this.sending = true;
            this.axios.post("/api/user-center/post-callback", data)
            .then(function (res) {
                that.title = '';
                that.content = '';
                that.sending = false;
                Message.success("发送成功");
            })
            .catch(function (err) {
                that.sending = false;
                Message.error(err.response.data.msg);
            })
        }
    }
}
</script>

