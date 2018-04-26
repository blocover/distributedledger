pragma solidity ^0.4.0;
contract Blocover {

    address internal owner;
    
    struct Song {
        bytes32 hash;
        uint256 playCounter;
    }
    
    struct User {
        string userId;
        string artistName;
    }
    
    // register for users + songs 
    Song[] songs;
    User[] users;

    constructor() public {
        owner = msg.sender;
    }
    
    function registerSong(bytes32 songHash) public {
        Song memory song;

        song.hash = songHash;
        song.playCounter = 0;
        int songIndex = int(songs.push(song));
    }
    
    function registerUser(string userId, string artistName) public {
        User memory user;
        user.userId = userId;
        user.artistName = artistName;
        int userIndex = int(users.push(user));
    }
    
    function play(uint256 songIndex) public {
        songs[songIndex].playCounter = songs[songIndex].playCounter + 1;
    }
    
    function getPlayCounter(uint256 songIndex) public view returns (uint256) {
        return songs[songIndex].playCounter;
    }
    


}