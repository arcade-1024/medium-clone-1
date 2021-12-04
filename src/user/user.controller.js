const AuthModule = require("../auth");
const authModule = new AuthModule();
const { service: authService } = authModule;

class UserController {
	constructor(userService) {
		this.userService = userService;
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

	getUser = async (req, res) => {
		const allUser = await this.userService.getAllUser();

		res.send(allUser.map((user) => this.showObjectData(user)));
	};

	getUserByName = async (req, res) => {
		const user = await this.userService.getByUserName(req.params.name);
		res.send(this.showObjectData(user));
	};

	registerUser = async (req, res) => {
		const status = await this.userService.registerUser(req.body.user);
		res.send(status);
	};

	getCurrentUser = async (req, res) => {
		try {
			res.send(this.showObjectData(req.user));
		} catch (e) {
			res.send({ error: "Some Error Occurred" });
		}
	};
	updateUser = async (req, res) => {
		const updates = req.body;
		try {
			const { user, error } = this.userService.updateCurrentUser(
				req.user.email,
				updates
			);
			if (error) {
				throw error;
			} else {
				res.send({ user: user, message: "user updated" });
			}
		} catch (e) {
			res.send({ error: e });
		}
	};

	initializeRouter = () => {
		return {
			rootRoute: "/users",
			routes: [
				{
					route: "/",
					method: "GET",
					middleware: [this.authService.ensureAuthenticated],
					function: this.getUser,
				},
				{
					route: "/profile/:name",
					method: "GET",
					middleware: [this.authService.ensureAuthenticated],
					function: this.getUserByName,
				},
				{
					route: "/profile",
					method: "GET",
					middleware: [this.authService.ensureAuthenticated],
					function: this.getCurrentUser,
				},
				{
					route: "/",
					method: "POST",
					middleware: [this.authService.ensureAuthenticated],
					function: this.registerUser,
				},
				{
					route: "/",
					method: "PATCH",
					middleware: [this.authService.ensureAuthenticated],
					function: this.updateUser,
				},
			],
		};
	};
}

module.exports = UserController;
