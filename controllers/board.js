const Blogpost = require('../models/post');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req,res) => {
    const blogposts = await Blogpost.find({})
    res.render('board/index', {blogposts})
}

module.exports.renderNewForm = (req,res) => {
    res.render('board/new')
}

module.exports.createPost = async (req,res) => {
    const blogpost = new Blogpost(req.body.blogpost);
    blogpost.images = req.files.map(f => ({url:f.path, filename: f.filename}));
    blogpost.author = req.user._id;
    await blogpost.save();
    console.log(blogpost);
    req.flash('success', 'Successfully made a new post')
    res.redirect(`/board/${blogpost._id}`)
}

module.exports.showPost = async(req, res) => {
    const blogpost = await Blogpost.findById(req.params.id).populate('author');
    if(!blogpost){
        req.flash('error', 'Cannot find that post!')
        return res.redirect('/board')
    } 
    res.render('board/show', {blogpost})
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const blogpost = await Blogpost.findById(id)
    if (!blogpost) {
        req.flash('error', 'Cannot find that blogpost!')
        return res.redirect('/board')
    }
    res.render('board/edit', {blogpost})
}

module.exports.updatePost = async(req, res) => {
    const {id} = req.params;
    const blogpost = await Blogpost.findByIdAndUpdate(id, {...req.body.blogpost});
    const imgs = req.files.map(f => ({url:f.path, filename: f.filename}))
    blogpost.images.push(...imgs);
    await blogpost.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await blogpost.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/board/${blogpost._id}`);
}

module.exports.deletePost = async(req, res) => {
    const {id} = req.params;
    await Blogpost.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/board')
}