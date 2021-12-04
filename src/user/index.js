const UserModel = require("../model/userModel");
const UserController = require("./user.controller");
const UserService = require("./user.service");
class UserModule {
	constructor() {
		this.service = new UserService(UserModel);
		this.controller = new UserController(this.service);
	}
}

module.exports = UserModule;
