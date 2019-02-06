const router = require('express').Router()
const axios = require('axios')
const uuid = require('uuid/v4')
const AdmZip = require('adm-zip')
const del = require('del')
const multer = require('multer')
const upload = multer({ dest: 'temp'})
const utilFunctions = require('../utility')
const fs = require('fs')


router.post('/', upload.single('file'), async (req, res, next) => {
    try{
        const id = uuid()
        await utilFunctions.readFileAsync(req.file.path)
        .then((data) => {
            const zip = new AdmZip(data)
            const zipEntries = zip.getEntries()
            let writeStream = fs.createWriteStream(`temp/${id}.raml`)
            del(req.file.path)
            console.log(`Deleting temporary file ${req.file.path} (Attachment)`)

            
            zipEntries.forEach((zipEntry) => {
                    writeStream.write(zipEntry.getData().toString('utf8'))
            })
        })
    
        await utilFunctions.readFileAsync(`temp/${id}.raml`)
        .then((data) => utilFunctions.ramlToOas20.convertData(data.toString('utf8')))
        .then((swagger) => {
            return axios.post(`http://localhost:${process.env.PORT || 7801}/fury`, JSON.parse(swagger))
        })
        .then(result => res.send(result.data))
        .catch(() => res.status(500).send("Cannot parse RAML archive (Invalid)"))
        
        del(`temp/${id}.raml`)
        console.log(`Deleting temporary file temp/${id}.raml (RAML)`)
    } catch(err){ 
        res.status(500).send("Cannot parse RAML archive. (Internal Error)")
    }
})

module.exports = router