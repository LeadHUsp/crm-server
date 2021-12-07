const User = require('../models/user');
const userService = require('../service/user-service');
const jwt = require('jsonwebtoken');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e);
        }
    }
    async login(req, res, next) {
        try {
        } catch (error) {}
    }
    async logout(req, res, next) {
        try {
        } catch (error) {}
    }
    async activate(req, res, next) {
        try {
        } catch (error) {}
    }
    async refresh(req, res, next) {
        try {
        } catch (error) {}
    }
}
module.exports = new UserController();
