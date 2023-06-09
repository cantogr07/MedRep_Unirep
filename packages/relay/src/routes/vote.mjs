
import { ethers } from 'ethers'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/MedRep.sol/MedRep.json")

export default ({ app, db, synchronizer }) => {
  app.post('/api/vote', async (req, res) => {

    try {
      const { publicSignals, proof } = req.body
      const epochKeyProof = new EpochKeyProof(publicSignals, proof, synchronizer.prover)
      const valid = await epochKeyProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      const currentEpoch = synchronizer.calcCurrentEpoch()
      const {
        upvote,
        downvote,
        index,
      } = req.body
      console.log(synchronizer.calcCurrentEpoch())
      if (currentEpoch !== Number(BigInt(epochKeyProof.epoch))) {
        res.status(400).json({ error: 'Wrong epoch' })
        return
      }
      const appContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi)
      // const contract =
      const calldata = appContract.interface.encodeFunctionData(
        'votePost',
        [epochKeyProof.publicSignals, epochKeyProof.proof, upvote, downvote, index]
      )
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
