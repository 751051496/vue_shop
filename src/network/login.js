import {request} from './network.js'
export function login_to(userInfo){
	return request({
		url:'/login',
		method:'post',
		data:{
			username:userInfo.username,
			password: userInfo.password
		}
	})
}