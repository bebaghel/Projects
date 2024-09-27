const express = require('express')
const router = express.Router();
const { user, ping } = require('../controller/index')

router.get('/', user)
router.get('/api/ping', ping)


module.exports = router;

