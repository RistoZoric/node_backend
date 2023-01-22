var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: String,
    description: String,
    reviewCount: String,
    src:String,
    date: { type: Date, default: Date.now },
  })


var Product= mongoose.model('Product', productSchema);
module.exports=Product