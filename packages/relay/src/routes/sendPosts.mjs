
import { ethers } from 'ethers'
import { APP_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { hash1 } from '@unirep/utils'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/MedRep.sol/MedRep.json")

export default ({ app, db, synchronizer }) => {
  app.post('/api/post', async (req, res) => {

    try {
      const { publicSignals, proof } = req.body
      const epochKeyProof = new epochKetProof(publicSignals, proof, synchronizer.prover)
      const valid = await signupProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      const currentEpoch = synchronizer.calcCurrentEpoch()

      const {
        type,
        inContestIndex,
        postIndex,
        description,
      } = req.body

      const descriptionHash = hash1([`0x${Buffer.from(description).toString('hex')}`])
      if (currentEpoch !== Number(BigInt(signupProof.epoch))) {
        res.status(400).json({ error: 'Wrong epoch' })
        return
      }
      const appContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi)
      // const contract =
      if (type == 0) {
        const calldata = appContract.interface.encodeFunctionData(
            'sendPost',
            [epochKeyProof.publicSignals, epochKeyProof.proof, descriptionHash]
          )
      } else {
        const calldata = appContract.interface.encodeFunctionData(
            'sendContestPost',
            [epochKeyProof.publicSignals, epochKeyProof.proof, descriptionHash, postIndex, inContestIndex]
          )
      }
      
      const hash = await TransactionManager.queueTransaction(
        APP_ADDRESS,
        calldata,
      )
      res.json({ hash })

    } catch (error) {
      res.status(500).json({ error })
    }

  })
}
