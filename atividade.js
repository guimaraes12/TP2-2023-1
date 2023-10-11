const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

const modelodeUsuario = mongoose.model('contas', new mongoose.Schema({
    email: String,
    password: String,
}))
const dotenv = require('dotenv')

if(process.env.NODE_ENV == 'PROD'){
    dotenv.config({path: './config/.env.prod'})
}

if(process.env.NODE_ENV == 'DEV'){
    dotenv.config({path: './config/.env.dev'})
}


mongoose.connect(process.env.DBURL)
  .then(()=>{

    app.post('/pegar-dados', async (req,res)=>{
    const usuarioEncontrado = await modelodeUsuario.findOne(req.body)
    res.send(usuarioEncontrado)
    })

    app.post('/postar-dados', async (req,res)=>{
    const usuarioCriado = await modelodeUsuario.create(req.body)
    res.send(usuarioCriado)
    })

    app.put('/atualizar-dados', async (req,res)=>{
    const usuarioAtualizado = await modelodeUsuario.findOneAndUpdate(
        {email: req.body.email, password: req.body.password},
        {email: req.body.newEmail, password: req.body.newPassword},
        {returnDocument: 'after'})

    res.send(usuarioAtualizado)
    })

    app.delete('/delete-dados', async (req,res)=>{
    const usuarioEncontrado = await modelodeUsuario.findOne(req.body)
    await modelodeUsuario.deleteOne(req.body, {returnDocument: 'before'})
    res.send(usuarioEncontrado)
    })

    app.listen(3030)
  })
