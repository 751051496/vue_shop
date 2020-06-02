import axios from 'axios'
export function request(config){
		const instance = axios.create({
			baseURL:'//119.23.53.78:8888/api/private/v1',
			timeout:5000
		})
		//2.axios拦截器
		instance.interceptors.request.use(config =>{
			// console.log(config)
			// 为请求头对象,添加token验证的Authorization字段
			config.headers.Authorization = window.sessionStorage.getItem('token')
			return config
			//return config
		},err =>{
			//console.log(err)
		});
		instance.interceptors.response.use(res =>{
			return res.data
			//return config
		},err =>{
			console.log(err)
		});
		//3.发送真正的请求
	return instance(config)
}