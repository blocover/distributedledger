pragma solidity ^0.4.0;

contract Blocover {

    address internal owner;

    
    struct Song {
        bytes hash;
        uint256 playCounter;
    }
    
    struct User {
        address userAddress;
        string userId;
        string artistName;
    }
    
    // register for users + songs 
    Song[] public songs;
    User[] public users;
    
    // donation token
    mapping(address => uint) public donations;
    mapping(uint => User) public userIdToUsers;
    

    event SongPlayer(int songIndex);
    event RegisterSong(int songIndex, bytes songHash);
    event RegisterUser(int userIndex, string artistName);
    event Play(uint songIndex, uint256 playCounter);
    event Donation(address userAddress, uint amount);
    

    constructor() public {
        owner = msg.sender;
    }
    
    function donate(address to) public payable{
        //address to = userIdToUsers[userId].userAddress;
        //donations[donationAddress] += msg.value;
        to.transfer(msg.value);
        //emit Donation(to, msg.value);
    }
    
    function registerSong(bytes songHash) public {
        Song memory song;

        song.hash = songHash;
        song.playCounter = 0;
        int songIndex = int(songs.push(song));
        emit RegisterSong(songIndex, songHash);
    }
    
    function registerUser(string userId, string artistName) public {
        User memory user;
        user.userId = userId;
        user.artistName = artistName;
        user.userAddress = msg.sender;
        int userIndex = int(users.push(user));
        emit RegisterUser(userIndex,artistName);
    }
    
    function play(uint songIndex) public {
        songs[songIndex].playCounter = songs[songIndex].playCounter + 1;
        emit Play(songIndex,songs[songIndex].playCounter);
    }
    
    function getPlayCounter(uint256 songIndex) public view returns (uint256) {
        return songs[songIndex].playCounter;
    }
    


}