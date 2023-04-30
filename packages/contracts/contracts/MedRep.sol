// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import { Unirep } from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MedRep {
    Unirep public unirep;

    address immutable operator;

    uint256 public postSubsidy = 3;

    uint256 public voteSubsidy = 1;

    uint256 public contestConstant = 5;

    enum PostType {
      post,
      contest
    }

    struct Post {
      uint256 index;
      PostType _type;

      uint256 contestStarter;
      uint256 postSender;

      uint256 contestIndex;
      uint256 incontestIndex;

      uint128 votesFor;
      uint128 votesAgainst;

      uint256 quality;

      uint256 epoch;
      uint256 descriptionHash;
    }

    struct contestVote {
      uint256 index;

      uint256 criteria1;
      uint256 criteria2;
      uint256 criteria3;
      uint256 criteria4;

      uint256 epoch;
    }

    // track the proposal numbers
    uint256 postIndex = 0;
    uint256 contestIndex = 0;
    uint256 contestVoteIndex = 0;

    mapping (uint256 => Post) public postsByIndex;
    mapping (uint256 => contestVote) public votesByIndex;
    // proposal index => epoch key => bool
    // mapping (uint256 => mapping(uint256 => bool)) epochKeyVotedForProposal;

    event postSubmitted(uint256 indexed index, Post post);
    event voteSubmitted(uint256 indexed index, uint256 epochKey);
    event contestVoteSubmitted(uint256 indexed index, contestVote vote);
    event prizeClaimed(uint256 epochKey, uint256 value);

    constructor(Unirep _unirep, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);

        operator = msg.sender;
    }

    // sign up users in this app
    function signUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public payable {

        unirep.userSignUp(publicSignals, proof);

    }

    function sendPost(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _descriptionHash) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      uint256 index = postIndex;
      Post memory post = Post({
        index: postIndex,
        _type: PostType.post,

        contestStarter: 0,
        postSender: publicSignals[1],

        contestIndex: 0,
        incontestIndex: 0,

        votesFor: 0,
        votesAgainst: 0,

        quality: 0,

        epoch: publicSignals[2],
        descriptionHash: _descriptionHash
      });

        postsByIndex[postIndex] = post;
        postIndex += postIndex;

      unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        0,
        postSubsidy,
        0
      );
      emit postSubmitted(index, post);
    }

    function votePost(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _upVote, uint256 _downVote, uint256 _postIndex) public {

      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      if (_upVote == 1 && _downVote == 0) {
        postsByIndex[_postIndex].votesFor += postsByIndex[_postIndex].votesFor;
        unirep.submitAttestation(
        publicSignals[2],
        postsByIndex[_postIndex].postSender,
        voteSubsidy / 10,
        0,
        0
      );
      }
      if (_downVote == 1 && _upVote == 0) {
        postsByIndex[_postIndex].votesAgainst += postsByIndex[_postIndex].votesAgainst;
        unirep.submitAttestation(
        publicSignals[2],
        postsByIndex[_postIndex].postSender,
        0,
        voteSubsidy / 10,
        0
      );
      }

      unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        0,
        voteSubsidy,
        0
      );
    }

    function startContest(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _descriptionHash) public {
      
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      Post memory contest = Post({
        index: postIndex,
        _type: PostType.contest,

        contestStarter: publicSignals[2],
        postSender: publicSignals[1],

        contestIndex: contestIndex,
        incontestIndex: 0,

        votesFor: 0,
        votesAgainst: 0,

        quality: 5,

        epoch: publicSignals[2],
        descriptionHash: _descriptionHash
      });

      postsByIndex[postIndex] = contest;
      postIndex += postIndex;
      contestIndex += contestIndex;
    }

    function sendContestPost(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _descriptionHash, uint256 _postIndex, uint256 _previousInContest) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      Post memory contest = Post({
        index: postIndex,
        _type: PostType.contest,

        contestStarter: postsByIndex[_postIndex].contestStarter,
        postSender: publicSignals[1],

        contestIndex: postsByIndex[_postIndex].contestIndex,
        incontestIndex: _previousInContest+1,

        votesFor: 0,
        votesAgainst: 0,

        quality: 5,

        epoch: publicSignals[2],
        descriptionHash: _descriptionHash
      });

        postsByIndex[postIndex] = contest;
        postIndex += postIndex;
    }

    function voteContest(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _criteria1, uint256 _criteria2, uint256 _criteria3, uint256 _criteria4) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      contestVote memory vote = contestVote({
        index: contestVoteIndex,

        criteria1: _criteria1,
        criteria2: _criteria2,
        criteria3: _criteria3,
        criteria4: _criteria4,

        epoch: publicSignals[2]
      });
      votesByIndex[contestVoteIndex] = vote;
      contestVoteIndex += contestVoteIndex;

      unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        0,
        voteSubsidy * 5,
        0
      );
    }

    function claimReporterPrize(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _postIndex) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      uint256 value;

      uint256 quality = postsByIndex[_postIndex].quality;
      if (quality > 3) {
        value = contestConstant * (quality - 3);
        unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        value,
        0,
        0
      );
      } else {
        value = contestConstant * (3 - quality);
        unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        0,
        value,
        0
      );
      }
    }

    function claimVoterPrize(uint256[] memory publicSignals, uint256[8] memory proof, uint256 _contestVoteIndex, uint256 _resultTotal) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);

      require(publicSignals[2] == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(publicSignals[3] == uint256(uint160(address(this))));

      uint criteria1 = votesByIndex[_contestVoteIndex].criteria1;
      uint criteria2 = votesByIndex[_contestVoteIndex].criteria2;
      uint criteria3 = votesByIndex[_contestVoteIndex].criteria3;
      uint criteria4 = votesByIndex[_contestVoteIndex].criteria4;

      uint criteriaTotal = criteria1 + criteria2 + criteria3 + criteria4;
      uint gain;

      if (criteriaTotal > _resultTotal) {
        gain = (criteriaTotal - _resultTotal) * 5 * voteSubsidy;
        unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        gain,
        0,
        0
      );
      } else {
        gain = (_resultTotal - criteriaTotal) * 5 * voteSubsidy;
        unirep.submitAttestation(
        publicSignals[2],
        publicSignals[1],
        0,
        gain,
        0
      );
      }

      
      

      
    }

}
