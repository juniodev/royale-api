const express = require('express');
const routes = require('./routes')

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(routes)

const started = () => {
  console.log('started on port ',PORT)
}

app.listen(PORT, started)