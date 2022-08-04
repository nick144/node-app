const User = require("../models/userModel")
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const {username, password} = req.body;
    const hassPassword = await bcrypt.hash(password, 12);
    try {
        const newUser = await User.create({
            username: username,
            password: hassPassword
        })
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail',
        })
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            });
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Incorrect username or password'
            });
        }
        
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            message: 'Something went wrong please try again'
            // message: e
        });
    }
}


exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.status(200).send('<center>You have successfully logged out!</center>');
    });
}