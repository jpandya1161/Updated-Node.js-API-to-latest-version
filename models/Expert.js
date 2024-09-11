class Expert {
  constructor() {}

  async getYogaSalesAmount() {
    var server = require("../server");
    var util = require("util");
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var data = 0;
    var allYogaClassPurchasePrice = await server.mc_subdomain.query(
      "SELECT (count(*)*class_master.price) AS total FROM user_class_master,class_master where user_class_master.class_id=class_master.id group by class_id"
    );

    for (var i in allYogaClassPurchasePrice)
      data += allYogaClassPurchasePrice[i]["total"];
    //console.log('YOGA = ' + data);
    return data;
  }

  async getGymSalesAmount() {
    var server = require("../Config");
    var util = require("util");
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var data = 0;
    var allGymClassPurchasePrice = await server.mc_subdomain.query(
      "SELECT (count(*)*membership_master.amount) AS totalAmount FROM membership_registration,membership_master WHERE membership_registration.membership_id=membership_master.id GROUP BY membership_id"
    );

    for (var i in allGymClassPurchasePrice)
      data += allGymClassPurchasePrice[i]["totalAmount"];
    //console.log('GYM  = ' + data);
    return data;
  }
}

module.exports = new Expert();
