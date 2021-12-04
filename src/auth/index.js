const AuthController = require("./auth.controller");
const AuthService = require("./auth.service");
const UserModel = require("../model/userModel");
class AuthModule {
	constructor() {
		this.service = new AuthService(UserModel);
		this.controller = new AuthController(this.service);
	}
}

module.exports = AuthModule;
