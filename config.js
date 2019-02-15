let CONFIG = {}
if (process.env.NODE_ENV === 'production') { // 生产环境
	CONFIG = {
		'DATABASE': 'mongodb://root:xhc151136@localhost/SINA?authSource=admin',
    'REDIS': {
      password: 'xhc151136'
    }
	}
} else {
	CONFIG = { // 开发环境
		'DATABASE': 'mongodb://root:xhc151136@47.101.221.188:27017/SINA?authSource=admin',
    'REDIS': {
      host: '47.101.221.188',
      port: 6379,
      password: 'xhc151136'
    }
    // 'DATABASE': 'mongodb://root:xhc151136@localhost/SINA?authSource=admin',
	}
}

module.exports = CONFIG

