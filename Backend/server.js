const express = require("express");
const bodyParser = require("body-parser");//necesario para crear un req.body
const cors = require("cors");//incluido ya en express

const app = express(); 

var corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));
// permite recibir json y archivos grandes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//BD
const db = require("./models/index");
const dbConfig = require("./config/db.config");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Te has conectado a MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
 
//CREO ROLES  
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// RUTAS
app.get("/", (req, res) => {
  res.json({ message: "Hola desde inicio." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// PUERTO
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});