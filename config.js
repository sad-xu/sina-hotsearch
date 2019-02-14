let CONFIG = {}
if (process.env.NODE_ENV === 'production') { // 生产环境
	CONFIG = {
		'DATABASE': 'mongodb://root:xhc151136@localhost/SINA?authSource=admin',

	}
} else {
	CONFIG = { // 开发环境
		// 'DATABASE': 'mongodb://root:xhc151136@47.101.221.188:27017/SINA?authSource=admin',
    'DATABASE': 'mongodb://root:xhc151136@localhost/SINA?authSource=admin',
	}
}

module.exports = CONFIG

