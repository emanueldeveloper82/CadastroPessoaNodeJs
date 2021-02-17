

var JSAlert = require("js-alert");
require('dotenv').config()

var moment = require('moment')
moment().format("d/M/yyyy")

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs')

var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

const MongoClient = require('mongodb').MongoClient 
const uri = process.env.DB_HOST
const ObjectId = require('mongodb').ObjectID
MongoClient.connect(uri, (err, client) => { 
    if (err) return console.log(err)
    db = client.db(process.env.DB_NAME)

    app.listen(3000, () => {
        console.log('server is running on port 3000')
    })
})


app.get('/home', (req, res) => {
  res.render('pages/home', {version:pjson})
})

app.get('/', (req, res) => {
  res.render('pages/home')
})


app.get('/pessoa/pessoaCadastrar', (req, res) => {
  res.render('pages/pessoaCadastrar')
})


/**
 * Necessário Paginar  
 */
app.get('/pessoa', (req, res) => {
  db.collection('pessoa').find().toArray((err, results) => {
      if (err) { 
        //tratamento de exceção
        return console.log(err)
      }
      res.render('pages/pessoa.ejs', { data: results })
  })
})

app.post('/salvarPessoa', (req, res) => {
    db.collection('pessoa').save(req.body, (err, result) => {
        if (err) { 
          //Mensagem erro na tela
          return console.log(err)
        }         
        //Mensagem sucesso na tela
        console.log('Salvo com sucesso!')
        res.redirect('/pessoa')
    })
})


app.route('/editarPessoa/:id').get((req, res) => {
  var id = req.params.id

  db.collection('pessoa').find(ObjectId(id)).toArray((err, result) => {
    if (err) {
      return res.send(err)
    }
    
    res.render('pages/pessoaEditar.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var nome = req.body.nome
  var nascimento = req.body.nascimento
  var sexo = req.body.sexo
  var telefone = req.body.telefone
  var email = req.body.email
  var endereco = req.body.endereco
  var cep = req.body.cep
  var cidade = req.body.cidade
  var estado = req.body.estado


  db.collection('pessoa').updateOne({_id: ObjectId(id)}, {
    $set: {
      nome: nome,
      nascimento: nascimento,
      sexo: sexo,
      telefone: telefone,
      email: email,
      endereco: endereco,
      cep: cep,
      cidade: cidade, 
      estado: estado

    }
  }, (err, result) => {
    if (err) 
      return res.send(err)

    res.redirect('/pessoa')
    console.log('Salvo com sucesso!')
  })
})


app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('pessoa').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/pessoa')
  })
})

function cancelar() {
  window.location.href="/pessoa"
}
