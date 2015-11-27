var databaseURI = "localhost:27017/list";
var collections = ["users", "driveways"];
var db = require("mongojs").connect(databaseURI, collections);

module.exports = db;