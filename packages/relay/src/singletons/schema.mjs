import { schema } from '@unirep/core'

const _schema = [
  {
    name: 'AccountTransaction',
    primaryKey: 'signedData',
    rows: [
      ['signedData', 'String'],
      ['address', 'String'],
      ['nonce', 'Int']
    ]
  },
  {
    name: 'AccountNonce',
    primaryKey: 'address',
    rows: [
      ['address', 'String'],
      ['nonce', 'Int'],
    ],
  },
  {
    name: 'Post',
    primaryKey: 'index',
    rows: [
      ['index', 'String', { unique: true }],
      ['type', 'Int'],
      ['contestStarter', 'String'],
      ['postSender', 'String'],
      ['contestIndex', 'String'],
      ['inContestIndex', 'String'],
      ['votesFor', 'Int'],
      ['votesAgainst', 'Int'],
      ['quality', 'Int'],
      ['epoch', 'Int'],
      ['descriptionHash', 'String'],
      ['executed', 'Int', { optional: true }],
      {
        name: 'description',
        type: 'Object',
        relation: {
          localField: 'descriptionHash',
          foreignField: 'hash',
          foreignTable: 'ProposalDescription',
        },
      },
    ]
  },
  {
    name: 'PostDescription',
    primaryKey: 'hash',
    rows: [
      ['hash', 'String'],
      ['text', 'String']
    ]
  },
  {
    name: 'voteContest',
    primaryKey: 'index',
    rows: [
      ['index', 'String', { unique: true }],
      ['criteria1', 'Int'],
      ['criteria2', 'Int'],
      ['criteria3', 'Int'],
      ['criteria4', 'Int'],
      ['epoch', 'Int'],
      ['executed', 'Int', { optional: true }],
      {
        name: 'description',
        type: 'Object',
        relation: {
          localField: 'descriptionHash',
          foreignField: 'hash',
          foreignTable: 'ProposalDescription',
        },
      },
    ]
  },
  {
    name: 'VoteDescription',
    primaryKey: 'hash',
    rows: [
      ['hash', 'String'],
      ['text', 'String']
    ]
  },
]

export default [...schema, ..._schema]
