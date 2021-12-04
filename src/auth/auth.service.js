const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthService {
	constructor(userModel) {
		this.userModel = userModel;
	}
	findUserByCredentials = async (email, password) => {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			return { error: "No user found", user: null };
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return { error: "Email or password is incorrect", user: null };
		}
		return { error: null, user };
	};
	ensureAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
	
			return next();
		}
		res.send({ error: "please authenticate" });
	};
	// signWithJWT = async (user) => {
	// 	try {
	// 		const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
	// 			expiresIn: "1day",
	// 		});
	// 		return token;
	// 	} catch (e) {}
	// };
	// verifyWithJWT = async (req, res, next) => {
	// 	const token = req.header("Authorization");
	// 	try {
	// 		if (!token) {
	// 			throw "Authentication Error,No token found";
	// 		}
	// 		const verify = jwt.verify(token, process.env.SECRET);
	// 		req.user = verify;
	// 		next();
	// 	} catch (e) {
	// 		return res.send({ error: e }).status(401);
	// 	}
	// };
}

module.exports = AuthService;
