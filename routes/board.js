const express=require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Blogpost = require('../models/post');
const {isLoggedIn, validateBlogpost, isAuthor} = require('../middleware.js');
const board = require('../controllers/board');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(board.index))
    .post(isLoggedIn, upload.array('image'), validateBlogpost, catchAsync(board.createPost))
    .post(upload.array('image'), (req,res) => {
        console.log(req.body, req.files);
        res.send("It Worked?")
    })

router.get('/new', isLoggedIn, board.renderNewForm);

router.route('/:id')
    .get(catchAsync(board.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBlogpost, catchAsync(board.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(board.deletePost))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(board.renderEditForm));


module.exports= router;