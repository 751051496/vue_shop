<template>
	<el-container class="home-container">
		<!-- 头部 -->
		<el-header>
			<div>
				<img src="../assets/image/header.svg" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logOut">退出</el-button>
		</el-header>
		<el-container>
			<!-- 侧边栏 -->
			<el-aside :width="isCollapse ? '64px':'200px'">
				<div class="toggle-button" @click="toggleCol">|||</div>
					<!-- 侧边栏菜单区 -->
				<el-menu
					background-color="#333744"
					text-color="#fff"
					active-text-color="#409EFF"
					unique-opened
					:collapse="isCollapse"
					:collapse-transition="false"
					:router="true"
					:default-active="activePath"
					>
					<!-- 1级菜单 -->
					<el-submenu :index="item.id +''" v-for="(item,index) in menuList" :key="index" >
						<!-- 1级菜单模板区域 -->
						<template slot="title"  >
							<!-- 图标 -->
							<!-- <i ="iconObject[item.id]"></i> -->
								<img v-for="" :src="iconObject[index][item.id]" alt="" style="width: 30px; height: 30px; margin-right: 10px;">		
							<span>{{item.authName}}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savaNavState('/'+subItem.path)">
							<template slot="title">
								<!-- 图标 -->
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>

					</el-submenu>
					
				</el-menu>
			</el-aside>
			<!-- 主页栏 -->
			<el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>


<script>
	import {menu} from '../network/menu.js'
  export default{
 	name:"Home",
	data(){
		return {
			// 左侧菜单
			menuList:[],
			iconObject:[
				{125:require ('../assets/image/menu/icon-font_user.svg')},
				{103:require ('../assets/image/menu/权限管理.svg')},
				{101:require ('../assets/image/menu/商品管理.svg')},
				{102:require ('../assets/image/menu/订单管理.svg')},
				{145:require ('../assets/image/menu/数据统计.svg')}
			],
			// 是否折叠
			isCollapse:false,
			// 被激活的链接地址
			activePath:''
		}
	},
	created(){
		this.getMenuList()
		this.activePath = window.sessionStorage.getItem('activePath')
	},
	methods:{
		logOut(){
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		// 获取菜单
		async getMenuList(){
			const result = await menu()
			if(result.meta.status !== 200) return this.$message.error(res.meta.msg)
			this.menuList = result.data
			
			
		},
		// 折叠按钮
		toggleCol(){
			this.isCollapse = ! this.isCollapse
		},
		// 保存链接激活状态
		savaNavState(activePath){
			window.sessionStorage.setItem('activePath',activePath)
			this.activePath = activePath
		}
	}

  }
</script>


<style scoped lang="less">
.home-container{
	height: 100%;
}
.el-header{
	background: #373d41;
	display: flex;
	justify-content: space-between;
	padding-left: 0;
	align-items: center;
	color: #FFF0FF;
	font-size: 20px;
	> div{
		display: flex;
		align-items: center;
	}
	span{
		margin-left: 15px;
	}
	img{
		width: 60px;
		height: 60px;
	}
}
.el-aside{
	background: #333744;
	.el-menu{
		border-right: none;
	}
}
.el-main{
	background: #eaedf1;
}
.toggle-button{
	background: #4A5064;
	font-size: 10px;
	line-height: 24px;
	color: #fff;
	text-align: center;
	letter-spacing: 0.2em;
	cursor: pointer;
}

</style>

