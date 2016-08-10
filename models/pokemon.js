var mongoose = require('mongoose');

//pokemon schema

var pokemonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true }
    },
    type: {
        type: String,
        required: true
    },
    cp: {
        type: Number,
        default: 10
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Pokemon = module.exports = mongoose.model('Pokemon', pokemonSchema);

//Get Pokemon
module.exports.getPokemons = function(callback, limit){
    Pokemon.find(callback).limit(limit);
};

//Get Pokemon by Name
module.exports.getPokemonByName = function(name, callback){
    var query = {name: name}
    Pokemon.find(query, callback);
};

//add pokemon
module.exports.addPokemon = function(pokemon, callback){
    Pokemon.create(pokemon, callback);
};

//update pokemon
module.exports.updatePokemon = function(name, pokemon, options, callback){
    var query = {name: name};
    var update = {
        name: pokemon.name,
        type: pokemon.type,
        cp: pokemon.cp
    };
    Pokemon.findOneAndUpdate(query, update, options, callback);
}

//Delete Pokemon
module.exports.deletePokemon = function(name, callback){
    var query = {name: name};
    Pokemon.remove(query, callback);
}
