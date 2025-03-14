const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
    treename: String,
    description: String,
    image: String
});

module.exports = mongoose.model("Tree", treeSchema);
