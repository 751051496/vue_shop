<template>
	<div>
		<el-button type="info" @click="logOut">退出</el-button>
	</div>

</template>


<script>
  export default{
 	name:'home',
	methods:{
		logOut(){
			// 清空token
			window.sessionStorage.clear()
			// 跳转到登录页面
			this.$router.push('/login')
		}
	}

  }
</script>


<style lang="less" scoped>


</style>

