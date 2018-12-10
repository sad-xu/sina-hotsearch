// 请求返回封装函数 


/*
	返回格式：
		{
			err: ,  		 // 状态码   Number
			errmsg: '',  // 错误信息 String
			data: 			 // 数据			 *
		}
*/

const response = function(res, data, err = 0, errmsg = '') {
	return res.json({
		err,
		errmsg,
		data
	})
}


module.exports = response

