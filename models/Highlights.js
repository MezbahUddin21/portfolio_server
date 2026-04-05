const mongoose = require('mongoose');

const HighlightsSchema= new mongoose.Schema({

    highlights:{
        type:String,
        require:true
    }


}, { timestamps: true });

module.exports = mongoose.model('highlights', HighlightsSchema);