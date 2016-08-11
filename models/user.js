var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name : {
        type: String,
        index: {unique:true}
    },
    password: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);

//get user by name
module.exports.getUserByName = function(name, callback){
    var query = {name: name};
    User.findOne(query, callback);
};

//add user
module.exports.addUser = function(user, callback){
    User.create(user, callback);
};
