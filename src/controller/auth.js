const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (user) {
            return res.status(400).json({
                message: 'User already register',
            });
        }
        const { firstName, lastName, email, password, username } = req.body;
        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            username,
        });
        _user.save((error, data) => {
            if (error) {
                console.log(error);
                return res.status(400).json({
                    message: 'Something went wrong',
                });
            }
            if (data) {
                return res.status(201).json({
                    user: data,
                    message: 'User created Success',
                });
            }
        });
    });
};
exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email,
    }).exec((error, user) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (user) {
            if (user.authenticate(req.body.password)) {
                const token = jwt.sign(
                    { _id: user._id, role: user.role },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: '1h',
                    }
                );
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.status(200).json({
                    token,
                    user: {
                        _id,
                        firstName,
                        lastName,
                        email,
                        role,
                        fullName,
                    },
                });
            } else {
                return res.status(400).json({
                    message: 'Invalid Password',
                });
            }
        } else {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    });
};
