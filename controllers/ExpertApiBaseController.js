class ExpertApiBaseController {
  async AuthoriseRequest(req, res) {
    try {
      var util = require("util");
      var server = require("../server");
      server.mc_superadmin.query = await util.promisify(
        server.mc_superadmin.query
      );

      var header = req.headers["authkey"];

      if (global.subdomain.length > 0) {
        var key = header;
        var expertObj = await server.mc_superadmin.query(
          "SELECT * FROM expert_master WHERE subdomain = ?",
          [global.subdomain]
        );

        if (expertObj.length > 0) {
          var apiObj = await server.mc_superadmin.query(
            "SELECT * FROM api_keys WHERE expert_id = ? AND `key` = ?",
            [expertObj[0]["id"], key]
          );

          if (apiObj.length > 0) return "success";
          else return "Authentication Required!";
        } else return "No user Found";
      } else return "URL not FOUND";
    } catch (e) {
      return res.json({
        message: "Authentication Error",
      });
    }
  }
}

module.exports = new ExpertApiBaseController();
