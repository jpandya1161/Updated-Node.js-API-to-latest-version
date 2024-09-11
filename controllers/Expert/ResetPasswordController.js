let Cryptr = require("cryptr");
let cryptr = new Cryptr("KintuDesignsSecretKey");
let fs = require("fs");

let server = require("../../server");
let util = require("util");

server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);

let setUserPass = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var userId = cryptr.decrypt(req.query["uid"]);
    var userObj = await server.mc_subdomain.query(
      "SELECT * FROM user_master WHERE id = ?",
      [userId]
    );
    if (userObj.length > 0) {
      var target_file =
        __dirname + "/../expert/template/reset_user_pass.blade.php";
      var content = fs.readFileSync(target_file);
      var arrayToReplace = ["{{$user_name}}", "{{$first_name}}", "{{$userId}}"];
      var arrayWithReplace = [
        userObj[0]["user_name"],
        userObj[0]["first_name"],
        userId,
      ];

      for (var i in arrayToReplace)
        content = content
          .toString()
          .replace(arrayToReplace[i], arrayWithReplace[i]);
      return content;
    }
  } catch (e) {
    console.log(e);
  }
};

let expertNewPassword = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var exp_id = cryptr.decrypt(req.query["exp_id"]);
    if (typeof req.query["ts"] != undefined || req.query["ts"] != "")
      var link_ts = req.query["ts"];
    else var link_ts = 0;

    var d = new Date();
    var ts = d.setDate(d.getDate());

    if (ts <= link_ts) {
      var admin = 1;
      if (exp_id) {
        var expObj = await server.mc_superadmin.query(
          "SELECT * FROM expert_master WHERE id = ?",
          [exp_id]
        );
        var expDetail = await server.mc_subdomain.query(
          "SELECT * FROM expert_detail WHERE expert_id = ?",
          [expObj[0]["id"]]
        );
        if (expObj.length > 0) {
          var target_file =
            __dirname + "/../expert/template/reset_expert_pass.blade.php";
          var content = fs.readFileSync(target_file);
          var arrayToReplace = [
            "{{$user_name}}",
            "{{$first_name}}",
            "{{$last_name}}",
            "{{$id}}",
            "{{$admin}}",
          ];
          var arrayWithReplace = [
            expObj[0]["user_name"],
            expDetail[0]["first_name"],
            expDetail[0]["last_name"],
            expObj[0]["id"],
            admin,
          ];

          for (var i in arrayToReplace)
            content = content
              .toString()
              .replace(arrayToReplace[i], arrayWithReplace[i]);
          return content;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setUserPass: setUserPass,
  expertNewPassword: expertNewPassword,
};
