// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @author 1001.digital
/// @title An extension that enables the contract owner to set and update the date of a public sale.
abstract contract WithSample is Ownable
{
    // Stores the sale start time
    uint256 private _sample;

    /// @dev Emitted when the sale start date changes
    event SampleChanged(uint256 time);

    /// @dev Initialize with a given timestamp when to start the sale
    constructor (uint256 time) {
        _sample = time;
    }

    /// @dev Sets the start of the sale. Only owners can do so.
    function setSample(uint256 time) public virtual onlyOwner beforeSample {
        _sample = time;
        emit SampleChanged(time);
    }

    /// @dev Returns the start of the sale in seconds since the Unix Epoch
    function sample() public view virtual returns (uint256) {
        return _sample;
    }

    /// @dev Returns true if the sale has started
    function sampleed() public view virtual returns (bool) {
        return _sample <= block.timestamp;
    }

    /// @dev Modifier to make a function callable only after sale start
    modifier afterSample() {
        require(sampleed(), "Sale hasn't started yet");
        _;
    }

    /// @dev Modifier to make a function callable only before sale start
    modifier beforeSample() {
        require(! sampleed(), "Sale has already started");
        _;
    }
}
