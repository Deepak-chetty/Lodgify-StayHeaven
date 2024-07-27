const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");

module.exports.signup = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signupPost = wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({
            email, username
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.logIn(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("Success", "Welcome to Airbnb");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
});


module.exports.login = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.loginPost =  async(req, res) => {
    req.flash("Success", "Welcome back to Airbnb!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("Success", "You logged out successfully");
        res.redirect("/listings");
    });
};