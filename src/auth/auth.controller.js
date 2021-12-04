const passport = require("passport");

class AuthController {
	constructor(authService) {
		this.authService = authService;
	}
	showObjectData = (object) => {
		const allowed = ["email", "name", "bio", "image"];
		return Object.keys(object._doc)
			.filter((key) => allowed.includes(key))
			.reduce((obj, key) => {
				obj[key] = object._doc[key];
				return obj;
			}, {});
	};
	// userLogin = async (req, res) => {
	// 	try {
	// 		const { email, password } = req.body;
	// 		const { error, user } = await this.authService.findUserByCredentials(
	// 			email,
	// 			password
	// 		);
	// 		if (error) throw error;
	// 		else {
	// 			const token = await this.authService.signWithJWT(user);
	// 			res
	// 				.header("Authorization", token)
	// 				.send({ user: this.showObjectData(user), token });
	// 		}
	// 	} catch (e) {
	// 		res.status(404).send({ error: e });
	// 	}
	// };
	userLogin = async (req, res) => {
		try {
			const user = req.user;
			res.send({
				message: "Login Successfully",
				user: this.showObjectData(user),
			});
		} catch (e) {
			res.send({ error: e }).status(404);
		}
	};
	userLogout = async (req, res) => {
		req.logOut();
		res.send({ message: "Log out successful" });
	};
	passportAuthenticate = (req, res, next) => {
		passport.authenticate("local")(req, res, next);
	};
	initializeAuthRouter = () => {
		return {
			rootRoute: "/users",
			routes: [
				{
					route: "/login",
					method: "POST",
					middleware: [this.passportAuthenticate],
					function: this.userLogin,
				},
				{
					route: "/logout",
					method: "GET",
					middleware: [this.authService.ensureAuthenticated],
					function: this.userLogout,
				},
			],
		};
	};
}

module.exports = AuthController;
