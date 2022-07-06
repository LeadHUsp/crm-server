const User = require('../../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (user) {
            return res.status(400).json({
                message: 'Admin already register',
            });
        }
        const { firstName, lastName, email, password, username } = req.body;
        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            username,
            role: 'admin',
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
                    message: 'Admin created Success',
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
            if (user.authenticate(req.body.password) && user.role === 'admin') {
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, {
                    expiresIn: '10h',
                });
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.cookie('token', token, { expiresIn: '10h' });
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
exports.verifyToken = (req, res) => {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, function (error, decoded) {
        if (error) {
            return res.status(400).json({ error });
        } else {
            User.findOne({
                _id: decoded._id,
            }).exec((error, user) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (user) {
                    const { _id, firstName, lastName, email, role, fullName } = user;
                    res.status(200).json({
                        user: {
                            _id,
                            firstName,
                            lastName,
                            email,
                            role,
                            fullName,
                        },
                    });
                }
            });
        }
    });
};
exports.signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Signout successfully',
    });
};
