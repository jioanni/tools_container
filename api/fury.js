const router = require('express').Router()
const utilFunctions = require('../utility')
const fury = require('fury')
const swaggerAdapter = require('fury-adapter-swagger')

fury.use(swaggerAdapter)

router.use('/raml', require('./raml'))

router.post("/", (req, res) => {
    utilFunctions.processInput(req, res)
});

module.exports = router