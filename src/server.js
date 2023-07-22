const express = require('express');
const app = express();
const server = require('http').createServer(app);
const sgMail = require('@sendgrid/mail');
const nunjucks = require('nunjucks');
require('dotenv').config();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Configuração arquivos estáticos
app.use(express.static("public"))

//Configuração template engine nunjucks

nunjucks.configure('src/views', {
    express: app,
    noCache: true,
})


//Routes
app.get('/', function(req,res) {
  res.render('index.html')
})



app.post('/', function(req,res) {
  const name = req.body.name

  console.log(name)

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 

const msg = {
  to: 'rogersenefaria@gmail.com', // Change to your recipient
  from: 'rogersenefaria@gmail.com', // Change to your verified sender
  subject: req.body.subject,
  // text: Olá Roger, você recebeu um novo contato de lead, abaixo está os dados do formularioreq.body.message,
  html: `Olá <strong>Roger</strong>,você recebeu um novo contato de lead, abaixo está os dados do formulário: <br><br>
          <strong> Nome: </strong> ${req.body.name} <br>
          <strong> E-mail: </strong> ${req.body.email} <br>
          <strong> Telefone Contato: </strong> ${req.body.phone} <br>
          <strong> Assunto: </strong> ${req.body.subject} <br>
          <strong> Mensagem: </strong> ${req.body.message} <br>
           `
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent' + 'Foi enviado com sucesso ')
    
    
    setTimeout(function() {
      res.render('index.html')},2500);
  })
  .catch((error) => {
    console.error(error)
  })

})

server.listen(3000);
