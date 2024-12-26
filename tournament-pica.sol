// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentMatch {
    struct Match {
        string player1;
        string player2;
        string winner;
        string score;
    }

    struct Tournament {
        string date;
        Match quarter1;
        Match quarter2;
        Match finals;
    }

    Tournament[] public tournaments;

    // Simplified addTournament function
    function addTournament(
        string memory date,
        string[4] memory quarter1Data, // [p1, p2, winner, score]
        string[4] memory quarter2Data,
        string[4] memory finalsData
    ) public {
        Tournament memory newTournament;
        
        newTournament.date = date;
        
        // Quarter 1
        newTournament.quarter1.player1 = quarter1Data[0];
        newTournament.quarter1.player2 = quarter1Data[1];
        newTournament.quarter1.winner = quarter1Data[2];
        newTournament.quarter1.score = quarter1Data[3];
        
        // Quarter 2
        newTournament.quarter2.player1 = quarter2Data[0];
        newTournament.quarter2.player2 = quarter2Data[1];
        newTournament.quarter2.winner = quarter2Data[2];
        newTournament.quarter2.score = quarter2Data[3];
        
        // Finals
        newTournament.finals.player1 = finalsData[0];
        newTournament.finals.player2 = finalsData[1];
        newTournament.finals.winner = finalsData[2];
        newTournament.finals.score = finalsData[3];
        
        tournaments.push(newTournament);
    }

    // Get total number of tournaments
    function getTournamentCount() public view returns (uint256) {
        return tournaments.length;
    }

    // Get tournament data by index
    function getTournament(uint256 index) public view returns (
        string memory date,
        string[4] memory quarter1Data,
        string[4] memory quarter2Data,
        string[4] memory finalsData
    ) {
        require(index < tournaments.length, "Tournament index out of bounds");
        
        Tournament memory tournament = tournaments[index];
        
        quarter1Data[0] = tournament.quarter1.player1;
        quarter1Data[1] = tournament.quarter1.player2;
        quarter1Data[2] = tournament.quarter1.winner;
        quarter1Data[3] = tournament.quarter1.score;
        
        quarter2Data[0] = tournament.quarter2.player1;
        quarter2Data[1] = tournament.quarter2.player2;
        quarter2Data[2] = tournament.quarter2.winner;
        quarter2Data[3] = tournament.quarter2.score;
        
        finalsData[0] = tournament.finals.player1;
        finalsData[1] = tournament.finals.player2;
        finalsData[2] = tournament.finals.winner;
        finalsData[3] = tournament.finals.score;
        
        return (tournament.date, quarter1Data, quarter2Data, finalsData);
    }
}


//status	0x1 Transaction mined and execution succeed
//transaction hash	0x2695a2656ffdcf624a230c9221a5d19748a6c701bfaf3f7117622a425595d24c
//block hash	0x8b9109b04ad38c548b973e7b5c78c78831c11c0ade4557eeb8fa6816a69aba51
//block number	7230857
//contract address	0x64dae20a8b2e5179a182d69b25ceaeb40fc85264
//from	0x7f4642c34b2476ff3ad518a183d4d5ab35d4261c
//to	TournamentMatch.(constructor)
//gas	1823364 gas
//transaction cost	1807849 gas 
//input	0x608...a0033
//decoded input	{}
//decoded output	 - 
//logs	[]
//raw logs	[]
//
//