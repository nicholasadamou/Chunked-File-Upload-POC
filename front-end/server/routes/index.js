const path = require('path');
const router = require('express').Router();

router.get('*', (req, res) => {
	const route = path.join(__dirname, '..', '..', 'build', 'index.html')
	res.sendFile(route)
})

module.exports = router
