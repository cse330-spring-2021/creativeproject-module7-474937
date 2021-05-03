const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    name: { type: String, unique: true, required: true },
    operations: { type: String, required: true },
    ownerID: { type: String, required: true },
    ownerName: { type: String},
    answers: { type: String},
    private: { type: Boolean},
    likes: { type: Number},
    tags: { type: [String]},
    createdDate: { type: Date, default: Date.now }
});

problemSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Problem', problemSchema);