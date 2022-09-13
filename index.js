const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//DATABASE
const connection = require("./databse/database");
const Pergunta = require("./databse/Pergunta");
const Resposta = require("./databse/Resposta");
//database

connection
    .authenticate()
    .then(() => console.log("Conection with database success"))
    .catch((err) => {
        console.log(err);
    })
    ;

app.listen(8080, () => console.log("App rodando"));
//sayng to express to use EJS to renderize html pages
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']//Decrecscente pelo ID
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
   
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta=> {
        if(pergunta != undefined){ //Pergunta válida
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
               
        }else{ //sem perguntas
            res.redirect("/")
        }
    }));
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then(()=> res.redirect("/pergunta/" + perguntaId));

})

