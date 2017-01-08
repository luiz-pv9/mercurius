const EventEmitter = require('events')
const express      = require('express')
const bodyParser   = require('body-parser')
const logger       = require('../logger')
const _            = require('lodash')
const Redis        = require('ioredis')

const defaultConfig = {
  host: '0.0.0.0',
  port: 8080,
  webhookPath: '/webhook'
}

class FacebookConnector extends EventEmitter {
  constructor(config) {
    super();
    this.config = _.merge(config, defaultConfig)
    this.redis = null
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(express.static(__dirname + '/facebook'))
    this.app.use(express.static(__dirname + '/assets'))
    this.app.get(config.webhookPath, this.onGetWebhook.bind(this))
    this.app.post(config.webhookPath, this.onPostWebhook.bind(this))

    this.app.get('/access_tokens', this.onGetAccessTokens.bind(this))
    this.app.post('/access_tokens', this.onPostAccessTokens.bind(this))
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

  onGetAccessTokens(req, res) {
    let take = 1
    let page = (+req.query.page || 0) * take
    let response = {}
    this.redis.zrange('facebook_pages.index', page, take, 'withscores')
    .then(records => {
      return this.fetchFacebookPages(records)
    })
    .then(records => {
      response.records = records
      return this.redis.zcount('facebook_pages.index', '-inf', '+inf')
    })
    .then(total => {
      response.total = total
      res.json(response)
    })
  }

  fetchFacebookPages(records) {
    return new Promise((resolve, reject) => {
      let fetchPipeline = this.redis.pipeline()

      records.filter((item, index) => {
        return index % 2 !== 0
      }).forEach(pageId => {
        fetchPipeline.hgetall(`facebook_pages:${pageId}`)
      })

      fetchPipeline.exec((err, results) => {
        if(err) return reject(err)

        results = results.map(record => {
          return record[1]
        })

        resolve(results)
      })
    })
  }

  onPostAccessTokens(req, res) {
    var accessToken = req.body;
    this.redis.hmset(`facebook_pages:${accessToken.pageId}`, accessToken)


    let indexId = parseInt(accessToken.pageId) || 0

    this.redis.zadd('facebook_pages.index', indexId, accessToken.name)
    res.json(accessToken)
  }

  initialize(registry) {
    this.registry = registry
    return new Promise(resolve => {
      this.redis = new Redis(this.config.redis)
      this.app.listen(this.config.port, () => {
        logger.info(`Facebook webhook listening on port [${this.config.port}]`)
        resolve()
      })
    })
  }
}

module.exports = FacebookConnector
