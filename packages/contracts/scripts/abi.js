const fs = require('fs')
const path = require('path')

const { abi } = require('../artifacts/contracts/MedRep.sol/MedRep.json')

fs.writeFileSync(
  path.join(__dirname, '../abi/MedRep.json'),
  JSON.stringify(abi)
)
