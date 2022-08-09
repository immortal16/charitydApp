// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Charity is Ownable {

    event newDonation(uint amount, string comment);

    uint public target;
 
    string public charityTitle;
    string public charityDescription;

    uint32 public totalDonations;
    uint public moneyRaised;

    mapping(address => uint) private supporters;

    function isEmpty(string memory _s) internal pure returns (bool) {
        return bytes(_s).length == 0;
    }

    function daysOfWar() public view returns (uint) {
        return (block.timestamp - 1645671600) / 60 / 60 / 24 + 1;
    }

    function myContribution() public view returns (string memory, uint) {
        uint donated = supporters[msg.sender];
        if (donated > 0) {
            return ("Thanks for your support.", donated);
        } else {
            return ("You have not donated yet.", 0);
        }
    }

    function processDonate(address _address, uint amount) internal {
        totalDonations++;
        moneyRaised += amount;
        supporters[_address] += amount;
    }

    function donate(string memory _comment) public payable {
        require(msg.value > 0, "Donation cannot be transferred.");
        processDonate(msg.sender, msg.value);

        emit newDonation(msg.value, _comment);
    }

    function setNewCharity(string memory _title, string memory _description) external onlyOwner {
        charityTitle = _title;
        charityDescription = _description;
    }

    function setTarget(uint _value) external onlyOwner {
        require(_value > 0, "Target cannot be set.");
        target = _value;
    }

    function sendToOrganization(address payable _to) external payable onlyOwner {
        require(target > 0 && address(this).balance > target, "Wait for more donations to have enough balance or set correct target.");
        _to.transfer(target);

        target = 0;
        totalDonations = 0;
        moneyRaised = 0;
        charityTitle = "";
        charityDescription = "";
    }
}