const local = {
  port: 3000,
  host: '0.0.0.0',
  mongoUrl: 'mongodb://admin:158200@cluster0.eegld.mongodb.net/Cluster0?retryWrites=true&w=majority',
  secret: '123456',
  tianApiKey:''
}
const development = {
}
const production = {
  port: 8081,
  mongoUrl:'mongodb://admin:158200@cluster0.eegld.mongodb.net/Cluster0?retryWrites=true&w=majority',
}
let config = Object.assign(local, development)
if (process.env.NODE_ENV == 'production') {
  config = Object.assign(local, production)
}
module.exports = config