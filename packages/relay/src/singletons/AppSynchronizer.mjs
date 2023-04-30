import { Synchronizer } from '@unirep/core'
import { provider, UNIREP_ADDRESS, DB_PATH, APP_ADDRESS } from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import prover from './prover.mjs'
import schema from './schema.mjs'
import { ethers } from 'ethers'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/MedRep.sol/MedRep.json")

const daoContract = new ethers.Contract(APP_ADDRESS, UnirepApp.abi, provider)

class DAOSynchronizer extends Synchronizer {
  get contracts() {
    return {
      ...super.contracts,
      [daoContract.address]: {
        contract: daoContract,
        eventNames: [
          'postSubmitted',
          'voteSubmitted',
          'contestVoteSubmitted',
          'prizeClaimed'
        ]
      }
    }
  }

/**
 * event handlers
 **/ 
  async handleprizeClaimed({event, db, decodedData}) {
    const index = BigInt(decodedData.index).toString()
    const { post } = decodedData
    db.update('Post', {
      where: {
        index: postIndex,
      },
      update: {
        executed: 1,
      }
    })
}

  async handlevoteSubmitted({event, db, decodedData}) {
    const index = BigInt(decodedData.index).toString()
    const { post } = decodedData
    db.update('Post', {
      where: {
        index: postIndex,
      },
      update: {
        ...(isFor ? { votesFor: 1, } : { votesAgainst: 1 })
      }
    })
}

async handlecontestVoteSubmitted({event, db, decodedData}) {
  const index = BigInt(decodedData.index).toString()
  const { voteContest } = decodedData
  db.create('voteContest', {
    index,
    criteria1: Number(voteContest.criteria1),
    critera2:Number(voteContest.criteria2),
    criteria3:Number(voteContest.criteria3),
    criteria4:Number(voteContest.criteria4),
    epoch: Number(voteContest.epoch)
  })
}

  async handlepostSubmitted({event, db, decodedData}) {
    const index = BigInt(decodedData.index).toString()
    const { post } = decodedData
    db.create('Post', {
      index,
      type: Number(post._type),
      contestStarter: post.contestStarter.toString(),
      postSender: post.postSender.toString(),
      contestIndex: post.contestIndex.toString(),
      inContestIndex: post.inContestIndex.toString(),
      votesFor: Number(post.votesFor),
      votesAgainst: Number(post.votesAgainst),
      quality: Number(post.quality),
      epoch: Number(post.epoch),
      descriptionHash: post.descriptionHash.toString(),
    })
  }
}

const db = await SQLiteConnector.create(schema, DB_PATH ?? ':memory:')
export default new DAOSynchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: APP_ADDRESS,
  prover,
})
