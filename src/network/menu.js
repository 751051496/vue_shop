import {request} from './network.js'
export function menu(){
	return request({
		url:'/menus',
		method:'get'	
	})
}