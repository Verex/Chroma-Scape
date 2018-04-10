# Dependencies
express= require 'express'
bodyParser= require 'body-parser'
low= require 'lowdb'

# Environment
PORT= process.env.PORT ? 59798

# Setup db
db= low 'db.json'

# Setup express
app= express()
app.use bodyParser.json()

# Routes
app.get '/',(req,res)->
  scores= db 'scores'

  res.json db.object

app.post '/',(req,res)->
  scores= db 'scores'
  scores.push req.body
  db.object.scores.sort (a,b)-> (b?.score|0) - (a?.score|0)

  if db.object.scores.length > 10
    db.object.scores.length= 10

  res.json db.object

# Boot
app.listen PORT

console.log 'Server Listening on %s',PORT