const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const BlogpostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    images: [ImageSchema],
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true, strict: false});

module.exports = mongoose.model('Blogpost', BlogpostSchema);