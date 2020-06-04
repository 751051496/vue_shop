<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图 -->
		<el-card>
			<el-table :data="rightsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="权限名称" prop="authName"></el-table-column>
				<el-table-column label="路径" prop="path"></el-table-column>
				<el-table-column label="权限等级" prop="level">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.level === '0'">一级权限</el-tag>
						<el-tag type="warning" v-else-if="scope.row.level === '1'">二级权限</el-tag>
						<el-tag type="danger" v-else>三级权限</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
	
</template>

<script>
	import {getRight} from '../../network/right.js'
	export default {
		name:'rights',
		data(){
			return {
				rightsList:[]
			}
		},
		created(){
			this.getRightList()
		},
		methods:{
			// 获取用户权限
			async getRightList(){
				const res = await getRight()
				if(res.meta.status!==200){
					return this.$message.error('获取权限列表失败')
				}
				this.rightsList = res.data
				console.log(this.rightsList)
			}
		}
	}
</script>

<style>
	
	
</style>
