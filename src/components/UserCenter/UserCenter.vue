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
                        <span style="padding-left:10px;color:#17233d;font-size:15px;">我的资料</span>
                    </div>
                    <form class="content-body">
                        <div style="width:100px;height:100px;border-radius:50%;position:relative;margin-top: 10px;">
                            <img class="profile" :src="userInfo.icon">
                            <input title="点击修改头像" type="file" @change="previewPic" name="icon" accept="image/*" style="cursor: pointer;width:100px;height:100px;border-radius:50%;opacity: 0;position: absolute;z-index: 11;top:0;left:0;">
                        </div>
                        <div style="width:300px;color:#48576a;margin-top:20px;" class="flex-row-inline">
                            <div style="padding-right:20px;width:80px;text-align:right;">用户名:</div>
                            <div style="width:207px;text-align:left">{{userInfo.userName}}</div>
                        </div>
                        <div style="width:300px;color:#48576a;margin-top:20px;" class="flex-row-inline">
                            <div style="padding-right:20px;width:80px;text-align:right;">昵称:</div>
                            <input class="nickNameInput" name="nickName" v-model="userInfo.nickName">
                        </div>
                        <button @click="upload()"  style="text-align:center" class="submit" >保存</button>
                    </form>
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
.profile {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
.nickNameInput {
    height:30px;
    padding:0 0 0 5px;
    border:1px solid lightgray;
    outline:medium;
    width:200px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 14px;
}
.submit {
    background:#00A1D6;
    border:none;
    height:30px;
    width:100px;
    border-radius: 5px;
    color: white;
    margin-top:20px;
    font-size: 14px;
    cursor: pointer;
}
</style>
<script>
import Head from "@/Head.vue"
import Menu from "@/components/UserCenter/Menu.vue"
import {Message} from "view-design"
export default {
    name: 'UserCenter',
    components: {
        "porn-head": Head,
        "usercenter-menu": Menu
    },
    data () {
        return {
            nickName: '',
            userInfo: {
                icon: "http://127.0.0.1:8080/global/defaultIcon.png"
            },
            iconFile: ''
        }
    },
    created () {
        
    },
    methods: {
        load () {
            var that = this;
            this.axios.get("/api/user-center/get-user-info")
            .then(function (res) {
                that.userInfo = res.data.userInfo;
                that.nickName = res.data.userInfo.nickName;
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
        },
        previewPic (e) {
            var that = this;
            var file = e.target.files[0];
            this.iconFile = e.target.files[0];
            var fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = function (e) {
                that.userInfo.icon = e.target.result;
            }
        },
        upload () {
            var that = this;
            var formdata = new FormData();
            if (this.iconFile) {
                formdata.append("icon", this.iconFile);
            }
            if (this.nickname !== this.userInfo.nickName) {
                formdata.append("nickname", this.userInfo.nickName);
            }
            this.axios({
                url: '/api/user-center/edit-info?',
                method: 'post',
                data: formdata,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                that.$route.push("/userCenter");
                Message.success("修改成功");
            }).catch((err) => {
                Message.error(err.response.data.msg);
            })
        }
    },
    mounted () {
        
    }
}
</script>