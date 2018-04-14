const shim = require('fabric-shim')

const Chaincode = class {
  async Init(stub) {
    // The Init method is called when the Smart Contract is instantiated by the blockchain network
    // Best practice is to have any Ledger initialization in separate function -- see initLedger()
    console.info('============INSTANTIATED CHAINCODE: mycc.js============')
    // We need to return a success or failure message
    return shim.success()
  }
  async Invoke(stub) {
    // The Invoke method is called as a result of an application request to run the Smart Contract
    // The calling application has to specify the particular smart contract function being called, with arguments

    // Get the called function name and arguments
    let ret = stub.getFunctionAndParameters()
    console.info(ret)

    // Get the function being called
    let method = this[ret.fcn]
    // Get the arguments
    let args = ret.params

    // Error handler to check for methods
    if (!method) {
      console.error(method + 'is not a function')
      throw new Error('Received unknown function ' + method)
    }

    //Try catch block for calling the method
    try {
      let payload = await method(stub, args)
      return shim.success(payload)
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async initLedger(stub, args) {
    console.info('======= Initialize Ledger ======')
    let accounts = [{
      name: 'Smith A.',
      balance: 5000
    },
    {
      name: 'Adams B.',
      balance: 2500
    },
    {
      name: 'Jackson M.',
      balance: 6500
    },
    {
      name: 'Bryant K.',
      balance: 10000
    }]
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].docType = 'account'
      await stub.putState(i, Buffer.from(JSON.stringify(account[i])))
      console.info('Added account ' + i + ' ' + accounts[i].name)
    }
    console.info("===== Ending Initialization =====")
  }

  async queryAccount(stub, args) {
    //Get account by id
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting queryAccount(id)')
    }
    let id = args[0]
    //account is a bytesarray
    let account = await stub.getState(id)

    //Check if it exists on the Ledger
    if (!account || account.toString().length <= 0) {
      throw new Error('Account: ' + id + ' does not exist.')
    }
    console.log(account.toString())
    return account
  }
}

shim.start(new Chaincode())
