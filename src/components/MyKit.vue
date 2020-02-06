<template>
<div>
    {{msg}}
</div>
</template>
<script>
export default {
    name: "MyKit",
    props: {
        msg: {
            type: String,
            default: ""
        }
    }
}
</script>
  