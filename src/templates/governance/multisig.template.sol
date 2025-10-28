// SPDX-License-Identifier: {{LICENSE}}
pragma solidity ^{{SOLIDITY_VERSION}};

contract {{WALLET_NAME}}Wallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public required;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    mapping(uint => mapping(address => bool)) public approved;
    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address[] memory _owners, uint _required) {
        require(_owners.length > 0, "owners required");
        require(_required > 0 && _required <= _owners.length, "invalid required");
        for (uint i; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }
        required = _required;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submit(address to, uint value, bytes memory data) external onlyOwner /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ {
        transactions.push(Transaction({to: to, value: value, data: data, executed: false, numConfirmations: 0}));
        emit Submit(transactions.length - 1);
    }

    function approveTx(uint txId) external onlyOwner {
        require(!approved[txId][msg.sender], "already approved");
        approved[txId][msg.sender] = true;
        transactions[txId].numConfirmations += 1;
        emit Approve(msg.sender, txId);
    }

    function revokeTx(uint txId) external onlyOwner {
        require(approved[txId][msg.sender], "not approved");
        approved[txId][msg.sender] = false;
        transactions[txId].numConfirmations -= 1;
        emit Revoke(msg.sender, txId);
    }

    function execute(uint txId) external onlyOwner /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ {
        Transaction storage transaction = transactions[txId];
        require(!transaction.executed, "already executed");
        require(transaction.numConfirmations >= required, "insufficient confirmations");

        transaction.executed = true;
        (bool ok, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(ok, "tx failed");
        emit Execute(txId);
    }
}


