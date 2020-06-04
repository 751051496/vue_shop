import {request} from './network.js'
export function getRight(){
	return request({
		url:'/rights/list',
		method:'get'
	})
}

export function getRoles(){
	return request({
		url:'/roles',
		method:'get'
	})
}

export function deleteRoles(role,rightId){
	return request({
		url:`roles/${role.id}/rights/${rightId}`,
		method:'delete'
	})
}

export function getRightData(){
	return request({
		url:`rights/tree`,
		method:'get'
	})
}

export function deliverRight(roleId,idStr){
	return request({
		url:`roles/${roleId}/rights`,
		method:'post',
		params:{
			rids:idStr
		}
	})
}