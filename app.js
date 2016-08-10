var express = require('express'); //importo o express
var app = express(); //crio o app do tipo express
var http = require('http'); //importa o http
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//importo o bodyParser
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/pokemondb');
var db = mongoose.connection;

//digo que vou usar json

var router = express.Router(); //meu roteador
Pokemon = require('./models/pokemon');//importando o modelo pokemon

router.get('/pokemons', function(req, res){
    Pokemon.getPokemons(function(err, pokemons){
        if(err){
            res.json("alguma coisa deu errado");
        }
        res.json(pokemons);
    });
}); //meu get pokemons retorna os pokemons

router.get('/pokemons/:_name', function(req, res){
    var name = req.params._name;
    Pokemon.getPokemonByName(name, function(err, pokemon){
        if (err) {
            res.json("alguma coisa deu errado");
        }
        res.json(pokemon);
    })
});

router.put('/pokemons/:_name', function(req, res){
    var name = req.params._name;
    var pokemon = req.body;
    Pokemon.updatePokemon(name, pokemon, {}, function(err, pokemon){
        if(err){
            res.json("algo deu errado");
        }
        res.json(pokemon);
    })
});

router.post('/pokemons', function(req, res){
    var pokemon = req.body;
    Pokemon.addPokemon(pokemon, function(err, pokemon){
        if(err) res.json("algo deu errado");
        res.json(pokemon);
    })
});

router.delete('/pokemons/:_name', function(req, res){
    var name = req.params._name;
    Pokemon.deletePokemon(name, function(err, pokemon){
        if(err) res.json("algo deu errado");
        res.json("Pokemon Removido");
    })
});


app.use('/api', router); //informa o app para usar o roteador

var httpServer = http.createServer(app);//cria o server
httpServer.listen(8080); //executar o server
console.log('Servidor Rodando na porta 8080');
