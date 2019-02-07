const router = require('express').Router()
const utilFunctions = require('../utility')


router.use('/raml', require('./raml'))

router.post("/", (req, res) => {
    utilFunctions.processInput(req, res)
});

module.exports = router