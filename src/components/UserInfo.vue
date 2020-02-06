<template>
    <form action="api/userinfo/post-icon" method="post" enctype="multipart/form-data">
    头像：<input type="file" name="icon"><br/>
    上传:<input type="submit" value="上传">
</form>
</template>
<script>
export default {
    name: 'UserInfo'
}
</script>