pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract ImageRegister is Destructible {

    struct Image {
        string ipfsHash;        // IPFS hash
        string title;           // Image title
        string description;     // Image description
        string tags;            // Image tags in comma separated format
        uint256 uploadedOn;     // Uploaded timestamp
        address owner;          // The owner of the picture
    }

    // Maps owner to their images
    mapping (address => Image[]) public ownerToImages;
    address[] public Owners;
    
    bool private stopped = false;

    event LogImageUploaded(
        address indexed _owner, 
        string _ipfsHash, 
        string _title, 
        string _description, 
        string _tags,
        uint256 _uploadedOn
    );


    event LogEmergencyStop(
        address indexed _owner, 
        bool _stop
    );


    modifier stopInEmergency { 
        require(!stopped); 
        _;
    }

    function() public {}

    function getOwnersCount(address _owner) 
        public view 
        stopInEmergency 
        returns (uint256) 
    {
        require(_owner != 0x0);
        return Owners.length;
    }



    function uploadImage(
        string _ipfsHash, 
        string _title, 
        string _description, 
        string _tags
    ) public stopInEmergency returns (bool _success) {
            
        require(bytes(_ipfsHash).length == 46);
        require(bytes(_title).length > 0 && bytes(_title).length <= 256);
        require(bytes(_description).length < 1024);
        require(bytes(_tags).length > 0 && bytes(_tags).length <= 256);

        uint256 uploadedOn = now;
        Image memory image = Image(
            _ipfsHash,
            _title,
            _description,
            _tags,
            uploadedOn,
            msg.sender
        );
        bool append = true;
        for(uint i = 0; i < Owners.length; i++){
            if(Owners[i] == msg.sender){
                append = false;
                break;
            }
        }
        if(append){
            Owners.push(msg.sender);
        }
        ownerToImages[msg.sender].push(image);

        emit LogImageUploaded(
            msg.sender,
            _ipfsHash,
            _title,
            _description,
            _tags,
            uploadedOn
        );

        _success = true;
    }


    function getImageCount(address _owner) 
        public view 
        stopInEmergency 
        returns (uint256) 
    {
        require(_owner != 0x0);
        return ownerToImages[_owner].length;
    }
    function getImageCountByIndex(uint userIndex) 
        public view 
        stopInEmergency 
        returns (uint256) 
    {
        address _owner = Owners[userIndex];
        require(_owner != 0x0);
        return ownerToImages[_owner].length;
    }

    function getImage(address _owner, uint8 _index) 
        public stopInEmergency view returns (
        string _ipfsHash, 
        string _title, 
        string _description, 
        string _tags,
        uint256 _uploadedOn,
        address owner
    ) {

        require(_owner != 0x0);
        require(_index >= 0 && _index <= 2**8 - 1);
        require(ownerToImages[_owner].length > 0);

        Image storage image = ownerToImages[_owner][_index];
        
        return (
            image.ipfsHash, 
            image.title, 
            image.description, 
            image.tags, 
            image.uploadedOn,
            image.owner
        );
    }

    function getImageByIndex(uint userIndex, uint8 _index) 
        public stopInEmergency view returns (
        string _ipfsHash, 
        string _title, 
        string _description, 
        string _tags,
        uint256 _uploadedOn,
        address owner
    ) {
        address _owner = Owners[userIndex];
        require(_owner != 0x0);
        require(_index >= 0 && _index <= 2**8 - 1);
        require(ownerToImages[_owner].length > 0);

        Image storage image = ownerToImages[_owner][_index];
        
        return (
            image.ipfsHash, 
            image.title, 
            image.description, 
            image.tags, 
            image.uploadedOn,
            image.owner

        );
    }


    function emergencyStop(bool _stop) public onlyOwner {
        stopped = _stop;
        emit LogEmergencyStop(owner, _stop);
    }
}