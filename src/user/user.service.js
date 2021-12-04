const express = require("express");
const router = express.Router();
const Joi = require("joi");
class UserService {
	constructor(userModel) {
		this.userModel = userModel;
	}
	registerValidation = (user) => {
		const validationSchema = Joi.object({
			name: Joi.string().min(6).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).max(20).required(),
		});
		return validationSchema.validate(user);
	};
	getAllUser = async () => {
		return await this.userModel.find({});
	};
	getByUserName = async (name) => {
		return await this.userModel.findOne({ name });
	};
	updateCurrentUser = async (email, updates) => {
		const allUpdates = Object.keys(updates);

		try {
			const user = await this.userModel.findOne({ email });
			if (!user) {
				throw "No user found, please login again";
			} else {
				allUpdates.forEach((update) => (user[update] = updates[update]));
				await user.save();
				return { user, error: null };
			}
		} catch (e) {
			return { error: e };
		}
	};
	registerUser = async (userData) => {
		try {
			const { error } = this.registerValidation(userData);
			if (error) {
				throw error.details[0].message;
			} else {
				const userCheck = await this.userModel.findOne({
					email: userData.email,
				});
				if (userCheck !== null) {
					throw "Email already exists";
				}
				const newUser = new this.userModel(userData);
				await newUser.save();
				return { message: "successfully registered user", user: newUser };
			}
		} catch (e) {
			return { error: e };
		}
	};
}

module.exports = UserService;
