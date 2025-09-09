const jwt = require("jsonwebtoken");

const JWTAuthenticate = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const user = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ message: "invalid token" });
    }
}

const AdminAuthenticate = async (req, res, next) => {
    try {
        let user = req.user;
        if (user.role == "admin")
            next()
        throw new Error("Admin only endpoint");
    } catch (err) {
        res.status(401).json({
            message: "This is an admin only endpoint",
            error: err,
            success: false
        });
    }
}

const WebMasterAuthenticate = async (req, res, next) => {
    try {
        let user = req.user;
        if (user.role == "webmaster")
            next()
        throw new Error("Webmaster only endpoint");
    } catch (err) {
        res.status(401).json({
            message: "This is a webmaster only endpoint",
            error: err,
            success: false
        })
    }
}

const MediaAuthenticate = async (req, res, next) => {
    try {
        let user = req.user;
        if (user.role == "media")
            next()
        throw new Error("Media only endpoint");
    } catch (err) {
        res.status(401).json({
            message: "This is a media only endpoint",
            error: err,
            success: false
        })
    }
}

module.exports = {
    JWTAuthenticate, AdminAuthenticate, WebMasterAuthenticate, MediaAuthenticate
}