import { ethers } from 'ethers'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/MedRep.sol/MedRep.json")

export default ({ app, db, synchronizer }) => {
  app.post('/api/prize', async (req, res) => {

    try {
      const { postIndex } = req.body
      const {
        totalresult,
        voteIndex,
        user,
      } = req.body

      const appContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi)
      // const contract =
      if (user == 1) {
        const calldata = appContract.interface.encodeFunctionData(
          'claimVoterPrize',
          [epochKeyProof.publicSignals, epochKeyProof.proof, voteIndex, totalResult]
        )
      } else {
        const calldata = appContract.interface.encodeFunctionData(
          'claimReporterPrize',
          [epochKeyProof.publicSignals, epochKeyProof.proof, postIndex]
        )
      } 
      
      const hash = await TransactionManager.queueTransaction(
        APP_ADDRESS,
        calldata,
      )
      res.json({ hash })

    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }

  })
}
