<template>
    <div>
        <div class="flex-column-inline menu">
            <div class="flex-row-center" style="width:150px;height:50px;box-sizing: border-box;border-top:1px solid lightgray;">
                <span>个人中心</span>
            </div>
            <a class="flex-row-inline menu-item" href="/userCenter">
                <img src="~static/img/usercenter.png">
                <span>我的资料</span>
            </a>
            <a class="flex-row-inline menu-item" href="/userCenter/message">
                <img src="~static/img/message.png">
                <span>我的消息</span>
            </a>
            <a class="flex-row-inline menu-item" href="/userCenter/security">
                <img src="~static/img/security.png">
                <span>安全中心</span>
            </a>
        </div>4
    </div>
</template>
<style scoped>
.menu {
    height:100%;
    box-sizing: border-box;
    border-bottom:1px solid lightgray;
    border-left:1px solid lightgray;
}
.menu-item {
    width:150px;
    height:50px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left:10px;
    box-sizing: border-box;
    border-top:1px solid lightgray;
}
.menu-item:last-child {
    border-bottom:1px solid lightgray;
}
.menu-item img {
    width: 20px;
    height: 20px;
    margin-left:16px;
}
.menu-item span {
    margin-left:10px;
    font-size: 15px;
}
.menu-item:hover {
    background: #f4f4f4;
}
a:visited {
    color: black;
}
</style>
<script>
export default {
    name: "Menu",
    data () {
        return {

        }
    }
}
</script>