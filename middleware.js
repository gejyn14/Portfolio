const {blogpostSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Blogpost = require('./models/post');

module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
    }

module.exports.validateBlogpost = (req, res, next) => {
    const {error} = blogpostSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const blogpost = await Blogpost.findById(id);
    if (!blogpost.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/board/${id}`);
    }
    next();
}
    