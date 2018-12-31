let CONFIG = {}
if (process.env.NODE_ENV === 'production') {
	CONFIG = {
		'DATABASE': 'mongodb://root:xhc151136@localhost/SINA?authSource=admin'
	}
} else {
	CONFIG = {
		'DATABASE': 'mongodb://localhost/SINA'
		// 'DATABASE': 'mongodb://root:xhc151136@47.101.221.188:27017/SINA?authSource=admin'
	}
}

module.exports = CONFIG

