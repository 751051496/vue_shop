<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
		</el-card>
		<!-- 角色列表区 -->
		<el-table :data="roleList" border stripe>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1 === 0 ? 'bdtop':'','v-center']">
						<!-- 渲染一级权限 -->
						<el-col :span="5">
							<el-tag>{{item1.authName}}</el-tag>
							<i class="el-icon-caret-right"></i>
						</el-col>
						<!-- 渲染二级、三级 -->
						<el-col :span="19">
							<!-- 渲染二级权限 -->
							<el-row :class="[i2 === 0 ? '':'bdtop','v-center']"
							 v-for="(item2,i2) in item1.children" :key="item2.id"
							 >
								<el-col :span="6">
									<el-tag type="success"  closable @click="removeItemById(scope.row,item2.id)">{{item2.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<el-col :span="18">
									<el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @click="removeItemById(scope.row,item3.id)">{{item3.authName}}</el-tag>
									
								</el-col>
							</el-row>
						</el-col>
					</el-row>
					
					<pre>{{scope.row}}</pre>
				</template>
			</el-table-column>
			<!-- 索引列 -->
			<el-table-column type="index">#</el-table-column>
			<el-table-column label="角色名称" prop="roleName"></el-table-column>
			<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
			<el-table-column label="操作" width="300px">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
					<el-button type="warning" icon="el-icon-setting"  size="mini" @click="showSetRight(scope.row)">分配权限</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分配权限的对话框 -->
		<el-dialog
		  title="分配权限"
		  :visible.sync="setRightDialogVisible"
		  width="50%" @close="setRightDialogClosed">
		  <el-tree :data='rightsList' :props="treeProps" show-checkbox
		  node-key="id"
		  default-expand-all
		  :default-checked-keys="defKeys"
		  ref="treeRef"></el-tree>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="setRightDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="allotRights">确 定</el-button>
		  </span>
		</el-dialog>
	</div>

</template>


<script>
	import {getRoles,deleteRoles,getRightData,deliverRight} from '../../network/right.js'
  export default{
 	name:"Roles",
	data(){
		return {
			roleList:[],
			// 控制权限对话框的显示
			setRightDialogVisible:false,
			// 所有权限的数据
			rightsList:[],
			// 树形控件的属性绑定对象
			treeProps:{
				label:'authName',
				children:'children'
			},
			// 默认选中的
			defKeys:[],
			// 当前即将分配角色权限Id
			roleId:''
		}
	},
	created(){
		this.getRolesList()
	},
	methods:{
		async getRolesList(){
			const res = await getRoles()
			if(res.meta.status !== 200){return this.$message.error('获取角色列表失败')}
			this.roleList = res.data
		},
		async removeItemById(role,rightId){
			//弹框
			const confirmRes =await this.$confirm('此操作将永久删除该文件,是否继续？','提示',{
				confirmButtonText:'确定',
				cancelButtonText:'取消',
				type:'warning'
			}).catch(err => err)
			if(confirmRes !== 'confirm'){
				return this.$message.info('取消了删除')
			}
			const res = await deleteRoles(role,rightId)
			if(res.meta.status !== 200){
				return this.$message.error('删除权限失败')
			}
			// this.getRolesList()
			role.children = res.data
		},
		// 展示分配权限的对话框
		async showSetRight(role){
			this.roleId = role.id
			// 获取所有权限的数据
			const res =await getRightData()
			if(res.meta.status !== 200){
				return this.$message.error('获取权限数据失败')
			}
			this.rightsList = res.data
			console.log(this.rightsList)
			// 递归获取三级节点的id
			this.getLeafKeys(role,this.defKeys)
			
			this.setRightDialogVisible = true
		},
		//通过递归的形式获取角色下所有三级权限的#id
		getLeafKeys(node,arr){
			if(!node.children){
				return arr.push(node.id)
			}
			node.children.forEach(item => this.getLeafKeys(item,arr))
		},
		// 清空数据
		setRightDialogClosed(){
			this.defKeys = []
		},
		// 点击为角色分配权限
		async allotRights(){
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			]
			const idStr = keys.join(',')
			const res = await deliverRight(this.roleId,idStr)
			if(res.meta.status!==200){
				return this.$message.error('分配权限失败')
			}
			this.$message.success('分配权限成功')
			this.getRolesList()
			this.setRightDialogVisible = false
		}
	}

  }
</script>


<style scoped>
.el-tag{
	margin: 7px;
}
.bdtop{
	border-top: 1px solid #eee;
}
.bdbottom{
	border-top: 1px solid #eee;
}
.v-center{
	display: flex;
	align-items: center;
}
</style>


