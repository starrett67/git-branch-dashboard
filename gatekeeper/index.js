
var { app } = require('./server')

var port = 9999

app.listen(port, null, function (err) {
  console.log('Gatekeeper, at your service: http://localhost:' + port)
})
