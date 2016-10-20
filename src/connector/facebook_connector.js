const EventEmitter = require('events')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('../logger')
const _ = require('lodash')

const defaultConfig = {
  host: '0.0.0.0',
  port: 8080,
  webhookPath: '/webhook'
}

class FacebookConnector extends EventEmitter {
  constructor(config) {
    super();
    this.config = _.merge(config, defaultConfig)
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.get(config.webhookPath, this.onGetWebhook.bind(this))
    this.app.post(config.webhookPath, this.onPostWebhook.bind(this))
  }

  onGetWebhook(req, res) {
    if(req.query['hub.mode'] === 'subscribe' &&
       req.query['hub.verify_token'] === this.config.validationToken) {
      logger.info(`Facebook webhook verified with success!`)
      res.status(200).send(req.query['hub.challenge'])
    } else {
      logger.info(`Facebook webhook failed`, req.query)
      res.sendStatus(403)
    }
  }

  onPostWebhook(req, res) {
    logger.info(`Facebook new data`, req.body)
    res.end('ok')
  }

  initialize(registry) {
    this.registry = registry
    return new Promise(resolve => {
      this.app.listen(this.config.port, () => {
        logger.info(`Facebook webhook listening on port [${this.config.port}]`)
        resolve()
      })
    })
  }
}

module.exports = FacebookConnector