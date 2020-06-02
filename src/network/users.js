import {request} from './network.js'
export function users(queryInfo){
	return request({
		url:'/users',
		method:'get',
		params:{
			query:queryInfo.query,
			pagenum:queryInfo.pagenum,
			pagesize:queryInfo.pagesize
		}
	})
}

export function changestate(userinfo){
	return request({
		url:`users/${userinfo.id}/state/${userinfo.mg_state}`,
		method:'put'

	})
}

export function usersAddInfo(usersMessage){
	return request({
		url:'/users',
		method:'post',
		data:{
			username:usersMessage.username,
			password:usersMessage.password,
			email:usersMessage.email,
			mobile:usersMessage.mobile
		}
	})
}
// 查询用户
export function userLookUp(id){
	return request({
		url:`/users/${id}`,
		method:'get'
	})
}
// 提交修改信息
export function userEditPut(editFrom){
	return request({
		url:`users/${id}`,
		method:'put',
		data:{
			email:editFrom.email,
			mobile:editFrom.mobile,
		}
	})
}

//删除用户
export function deleteUser(id){
	return request({
		url:`/users/${id}`,
		method:'delete'
	})
}
