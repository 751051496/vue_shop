<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片式图 -->
		<el-card>
			<!-- 搜索区域 -->
			<el-row :gutter="40">
				<el-col :span="10">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type='primary' @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表区 -->
			<el-table :data="userList" border stribe>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						{{scope.row.mg_state}}
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 编辑 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUsersById(scope.row.id)"></el-button>
						<!-- 设置 -->
						<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" >
						  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)" ></el-button>
						</el-tooltip>
						
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
			  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			  :page-size="queryInfo.pagesize" :page-sizes="[1,2,5,10]"
			  layout="total,sizes,prev, pager, next,jumper"
			  :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog
		  title="提示"
		  :visible.sync="addDialogVisible"
		  width="50%"
		  @close="addDialogClosed">
		  <!-- 内容主题区 -->
		  <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFromRules">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="addForm.username"></el-input>	
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="addForm.password"></el-input>	
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="addForm.email"></el-input>	
			</el-form-item>
			<el-form-item label="手机" prop="mobile">
				<el-input v-model="addForm.mobile"></el-input>	
			</el-form-item>
		  </el-form>
		  <!-- 底部区 -->
		  <span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addUser">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--  修改用户对话框-->
		<el-dialog
		  title="修改用户"
		  :visible.sync="addEditDialogVisible"
		  width="50%"
		  @click="editDialogClose"
		  >
		  <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
		  <el-form-item label="用户名">
			<el-input v-model="editFrom.username" disabled></el-input>
		  </el-form-item>
		   <el-form-item label="邮箱" prop="email">
		  			<el-input v-model="editFrom.email" ></el-input>
		  </el-form-item>
		   <el-form-item label="手机号" prop="mobile">
		  			<el-input v-model="editFrom.mobile" ></el-input>
		  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="addEditDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="editUserInfo">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 分配角色的对话框 -->
		<el-dialog
		  title="分配角色"
		  :visible.sync="setRoleVisible"
		  width="50%">
		  <div>
			  <p>当前的用户:{{userinfo.username}}</p>
			  <p>当前的角色:{{userinfo.role_name}}</p>
			  <p>分配新角色:
				<el-select v-model="selectedRoleId" placeholder="请选择">
					<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
				</el-select>
			  </p>
		  </div>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="setRoleVisible = false">取 消</el-button>
			<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
		  </span>
		</el-dialog>
	</div>

</template>


<script>
	import {users,changestate,usersAddInfo,userLookUp,userEditPut,deleteUser,deliverUser} from '../../network/users.js'
	import {getRoles} from '../../network/right.js'
  export default{
 	name:'Users',
	data(){
		// 自定义验证邮箱规则
		var checkEmail = (rule,value,cb) =>{
			const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
			if(regEmail.test(value)){
				return cb()
			}
			cb(new Error('请输入合法的邮箱'))
		}
		
		var checkMobile = (rule,value,cb) =>{
			const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
				if(regMobile.test(value)){
					return cb()
				}
				cb(new Error('请输入合法的手机号'))
			}
		return {
			queryInfo:{
				query:'',
				pagenum:1,
				pagesize:2
			},
			userList:[],
			total:0,
			// 添加用户对话框的显示
			addDialogVisible:false,
			// 修改用户对话框
			addEditDialogVisible:false,
			// 分配角色对话框的显示与隐藏
			setRoleVisible:false,
			userinfo:{},
			// 所有角色的数据列表
			rolesList:[],
			selectedRoleId:'',
			
			
			// 查询用户信息对象保存
			editFrom:{},
			editFromRules:{
				email:[
					{required:true,message:'请输入用户邮箱',trigger:'blur'},{validator:checkEmail,trigger:'blur'}
				],
				mobile:[
					{required:true,message:'请输入用户手机',trigger:'blur'},{validator:checkMobile,trigger:'blur'}
				]
			},
			
			// 添加用户的表单数据
			addForm:{
				username:'',
				password:'',
				email:'',
				mobile:''
			},
			// 添加表单的验证规则
			addFromRules:{
				username:[
					{required:true,message:"请输入用户名",trigger:'blur'},{min: 3,max:10,message:"用户名的长度在3~10个字符之间",trigger:'blur'}
				],
				password:[
					{required:true,message:"请输入用户名",trigger:'blur'},{min: 6,max:15,message:"用户名的长度在6~15个字符之间",trigger:'blur'}
				],
				email:[
					{required:true,message:"请输入邮箱",trigger:'blur'},{validator:checkEmail,trigger:'blur'}
				],
				mobile:[
					{required:true,message:"请输入手机号",trigger:'blur'},{validator:checkMobile,trigger:'blur'}
				]
			}
		}

	},
	created(){
		this.getUserList()
	},
	methods:{
		async getUserList(){
			const res = await users(this.queryInfo)
			// console.log(res)
			if(res.meta.status !== 200) return this.$message.error('获取用户失败')
			this.userList = res.data.users
			this.total = res.data.total
			// console.log(res)
		},
		// 监听pagesize改变的事件
		handleSizeChange(newSize){
			console.log(newSize)
			this.queryInfo.pagesize = newSize
			this.getUserList()
		},
		// 监听页码值改变的事件
		handleCurrentChange(newPage){
			// console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},
		// switch开关状态的改变
		async userStateChanged(userinfo){
			// console.log(userinfo)
			const res = await changestate(userinfo)
			if(res.meta.status !== 200){
				userinfo.mg_state = !userinfo.mg_state
				return this.$message.error('更新用户状态失败')
			}
			this.$message.success('更新用户状态成功')
		},
		// 添加用户对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},
		// 点击按钮,添加新用户
		addUser(){
			this.$refs.addFormRef.validate(async valid =>{
				if(!valid) return 
				//添加请求
				const res = await usersAddInfo(this.addForm)
				if(res.meta.status !== 201){
					this.$message.error('添加用户失败')
				}
				this.$message.success('添加用户成功')
				// 隐藏对话框
				this.addDialogVisible = false
				this.getUserList()
			})
		},
		// 编辑用户对话框
		async showEditDialog(id){
			// console.log(id)
			const res = await userLookUp(id)
			// console.log(res)
			if(res.meta.status !== 200){return this.$message.error('查询用户信息失败')}
			this.editFrom = res.data
			this.addEditDialogVisible = true
		},
		// 监听修改用户对话框的关闭事件
		editDialogClose(){
			this.$refs.editFromRef.resetFields()
		},
		// 修改用户并提交
		editUserInfo(){
			this.$refs.editFromRef.validate(async valid =>{
				if(!valid) return
				//发起修改用户信息的数据请求
				const res = await userEditPut(this.editFrom)
				if(res.meta.status !== 200){
					return this.$message.error('更新用户信息失败')
				}
				// 关闭对话框
				this.addEditDialogVisible = false
				console.log('关闭')
				// 刷新列表
				this.getUserList()
				// 提示修改成功
				this.$message.success('更新用户信息成功')
				
			})
		},
		// 删除用户
		async removeUsersById(id){
			const confiremResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).catch(err => err)
			
			if(confiremResult !== 'confirm'){
				return this.$message.info('已经取消删除')}
			const res = await deleteUser(id)
			if(res.meta.status!== 200){
				return this.$message.error('删除用户失败')
			}
			this.$message.success('删除用户成功')
			this.getUserList()
			
		},
		// 展示分配角色的对话框
		async setRole(userinfo){
			this.userinfo = userinfo
			// 在展示对话框之前获取所有角色列表
			const res = await getRoles()
			if(res.meta.status !== 200){return this.$message.error('获取角色列表失败')}
			
			this.rolesList = res.data
			this.setRoleVisible = true
		},
		// 点击按钮,分配角色
		async saveRoleInfo(){
			if(!this.selectedRoleId){
				return this.$message.error('请选择要分配的角色')
			}
			
			const res =await deliverUser(this.userinfo.id)
			if(res.meta.status !== 200){
				return this.$message.error('更新角色')
			}
			
			this.$message.success('分配角色成功')
		}
	}

  }
</script>


<style lang="less" scoped>


</style>

