const fs = require('fs')
const AdmZip = require('adm-zip')
const uuid = require('uuid/v4')
const ramlConverter = require('oas-raml-converter')
const del = require('del')

const ramlToOas20 = new ramlConverter.Converter(ramlConverter.Formats.RAML, ramlConverter.Formats.OAS20)


const zipIterate = async (archive, target) => {
    const id = uuid()
    try{
    const data = fs.readFileSync(archive)
    const zip = new AdmZip(data)
    zip.extractAllTo(target)
    } catch(err) {
        console.error(err)
    }

    const dirName = nameRetrieve(archive)
    const entryPoint = entryFinder(`${target}/${dirName}`)
    
    ramlToOas20.convertFile(entryPoint)
    .then((swagger) => {
        let writeStream = fs.createWriteStream(`temp/${id}.json`)
        writeStream.write(swagger)
    })
    .catch(err => console.error(err))

    // del(`${target}/${id}.json`)

}



const entryFinder = (dirname) => {
      let entryPoint
      const filenames = fs.readdirSync(dirname)
      filenames.forEach(filename => {
          const stats = fs.statSync(`${dirname}/${filename}`)
          if(stats.isDirectory()){
              return entryFinder(`${dirname}/${filename}`)
          } else {
              const data = fs.readFileSync(`${dirname}/${filename}`)
              if (data.toString('utf-8').includes('baseUri')) {
                    entryPoint = `${dirname}/${filename}`
              }
          }
    })

    return entryPoint

  }
  
  

const nameRetrieve = (name) => {
    let phase1 = name.split('/')[1]
    let phase2 = phase1.split('.')[0]

    return phase2
}


zipIterate('test_files/alainn-mobile-shopping.zip', 'temp')





