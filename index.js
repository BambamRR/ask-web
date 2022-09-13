const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./databse/database");
const Pergunta = require("./databse/Pergunta");
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
    Pergunta.findAll({ raw: true}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
   
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
})

app.get

