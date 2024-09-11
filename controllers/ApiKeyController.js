class ApiKeyController {
  constructor() {
    this.ApiKeyModal = require("../models/ApiKeyModal");
    this.ApiKeyModal.createTable();
  }

  async ApiKeyControllerfn(req, res, id) {
    try {
      var server = require("../server");
      var util = require("util");

      server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);

      var table = "api_keys";
      var result = {};

      let expert_id = id;
      let device_uuid = req.body.device_uuid || "";
      let model = req.body.model || null;
      let platform = req.body.platform || null;
      let version = req.body.version || null;
      let manufacturer = req.body.manufacturer || null;
      let isVirtual = req.body.isVirtual || null;
      let serial = req.body.serial || null;

      var apiKey = await server.mc_superadmin.query(
        "SELECT * FROM " + table + " WHERE expert_id = ? AND device_uuid = ?",
        [expert_id, device_uuid]
      );

      var key = await this.ApiKeyModal.generateKey();
      if (apiKey.length == 0) {
        var inserted = await server.mc_superadmin.query(
          "INSERT INTO " +
            table +
            " (expert_id,device_uuid,`key`,model,version,platform,manufacturer,isVirtual,serial,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())",
          [
            expert_id,
            device_uuid,
            key,
            model,
            version,
            platform,
            manufacturer,
            isVirtual,
            serial,
          ]
        );

        if (inserted["affectedRows"] > 0) {
          result = {
            status: "success",
            expert_id: expert_id,
            device_key: key,
          };
        }
      } else {
        var updated = await server.mc_superadmin.query(
          "UPDATE " +
            table +
            " SET `device_uuid`= ?, `key`= ?, updated_at = NOW() WHERE expert_id = ? AND device_uuid = ?",
          [device_uuid, key, expert_id, device_uuid]
        );
        if (updated["affectedRows"] > 0) {
          result = {
            status: "success",
            expert_id: expert_id,
            device_key: key,
          };
        }
      }
      return result;
    } catch (ex) {
      console.log(ex);
    }
  }
}
module.exports = new ApiKeyController();
