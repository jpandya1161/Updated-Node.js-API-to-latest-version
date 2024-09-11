class ApiKeyModal {
  constructor() {
    this.moment = require("moment");

    this.option = {
      min: 0,
      max: 10000000000,
      integer: true,
    };
  }

  async createTable() {
    var server = require("../server");
    var util = require("util");
    server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);
    //server.mc_subdomain_query = util.promisify(server.mc_subdomain.query);

    try {
      var table = await server.mc_superadmin.query(
        "CREATE TABLE IF NOT EXISTS api_keys (id INTEGER PRIMARY KEY AUTO_INCREMENT,expert_id INTEGER null,is_expert INTEGER default 1,`key` VARCHAR(250),device_uuid VARCHAR(250) NULL default null,model TEXT NULL default null,platform TEXT NULL default null,version TEXT NULL default null,manufacturer TEXT NULL default null,isVirtual INTEGER NULL default 1,serial TEXT NULL default null,created_at TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL default CURRENT_TIMESTAMP)"
      );
    } catch (e) {
      console.log(e);
    }
  }

  generateKey() {
    var salt = require("sha1")(
      Math.floor(Date.now() / 1000) + "" + require("random-number")(this.option)
    );
    this.key = salt.substr(0, 40);
    return this.key;
  }
}

module.exports = new ApiKeyModal();
