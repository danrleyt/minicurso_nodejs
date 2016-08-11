var express = require('express'); //importo o express
var app = express(); //crio o app do tipo express
var http = require('http'); //importa o http
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var Pokemon = require('./models/pokemon');

var port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/pokemondb');
app.set('secret', config.secret);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var db = mongoose.connection;

app.use(morgan('dev'));

app.get('/', function(req, res){
    res.send('Olá, voce está na PokeAPI');
});

app.post('/user', function(req, res){
    var user = req.body;
    User.addUser(user, function(err, user){
        if(err) res.json("algo deu errado");
        res.json(user);
    });
});

app.get('/pokemons/:_name', function(req, res){
    var name = req.params._name;
    Pokemon.getPokemonByName(name, function(err, pokemon){
        if (err) {
            res.json("alguma coisa deu errado");
        }
        res.json(pokemon);
    })
});

var router = express.Router(); //meu roteador
//importando o modelo pokemon
router.post('/autenticar', function(req, res){
    User.getUserByName(req.body.name, function(err, user){
        if(err) res.json("erro usuario nao foi encontrado");
        if(!user){
            res.json("a autenticacao falhou");
        }else if(user){
            if(req.body.password != user.password){
                res.json("senha invalida");
            }else{
                var token = jwt.sign(user, app.get('secret'),{
                    expiresIn: 3600
                });
                res.json({token : token});
            }
        }
    });
});

router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, app.get('secret'), function(err, decoded){
            if(err){
                return res.json('token com problema');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }else {
        return res.status(403).send("seu token é invalido");
    }
});

router.get('/pokemons', function(req, res){
    Pokemon.getPokemons(function(err, pokemons){
        if(err){
            res.json("alguma coisa deu errado");
        }
        res.json(pokemons);
    });
}); //meu get pokemons retorna os pokemons

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
httpServer.listen(port); //executar o server
console.log('Servidor Rodando na porta 8080');
