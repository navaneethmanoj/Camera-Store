const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "x876cz7tk4vt9xd9",
  publicKey: "3652t8y4b4crxfh6",
  privateKey: "1167abb8512f1b3bd72e2d8b4fd365b6"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, (err, response) => {
        // pass clientToken to your front-end
        if(err){
            res.status(500).send(err)
        } else {
            res.send(response)
        }
        //const clientToken = response.clientToken
      });
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        //deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              return res.status(500).json(err)
          } else {
              res.json(result)
          }
      });
}

