const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");

const issue2options = {
  origin: true,
  methods: ["POST", "GET", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 3600,
  exposedHeaders: ["Total-Count", "Unread-Count"],
};

app.use(cors(issue2options));
app.options("*", cors());


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//rotas importadas de router
app.use('/animais', require('./Routes/animalRoutes'))
app.use('/admin', require('./Routes/adminRoutes'))
app.use('/adotantes', require('./Routes/adotanteRoutes'))
app.use('/resgates', require('./Routes/resgateRoutes'))

const server = app.listen(3000, function(){
   const host = server.address().address;
   const port = server.address().port;
   console.log(`Servidor iniciado em http://localhost:${port}`)
});
