class AssignProgrammes {
  async createTable() {
    let server = require("../server");
    let util = require("util");
    server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);
    server.mc_subdomain_query = util.promisify(server.mc_subdomain.query);

    try {
      var table = await server.mc_superadmin.query(
        "CREATE TABLE IF NOT EXISTS assigned_programmes (id INTEGER PRIMARY KEY AUTO_INCREMENT,user_id INTEGER NULL default null,programme_id INTEGER NULL default null,programme_start_date DATE NULL default null,programme_end_date DATE NULL default null,exercise_plan_id INTEGER NULL default null,exercise_plan_start_date DATE NULL default null,exercise_plan_end_date DATE NULL default null,diet_plan_id INTEGER NULL default null,diet_plan_start_date DATE NULL default null,diet_plan_end_date DATE NULL default null,programme_status INTEGER default 1)"
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AssignProgrammes();
