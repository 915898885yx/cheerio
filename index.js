const cheerio = require('cheerio')
const request = require('request')
const {MongoClient, ObjectID} = require('mongodb')
const dbUrl = 'mongodb://localhost:27017"'
let pageNum = 1
let resultList = []
const getUrl = (pageNum) => `https://movie.douban.com/top250?start=${(pageNum - 1) * 25}&filter=`
const sendRequest = (url) => {
  request(url, {}, (req, res) => {
    const {body} = res
    const $ = cheerio.load(body, { decodeEntities: false })
    MongoClient.connect(dbUrl, {useUnifiedTopology: true}, (err, db) => {
      if (err){
        console.log(err)
        process.exit(0)
      }
      var dbase
      if ($('.hd').length  <= 0) {
        db.close()
        db = null
        process.exit(0)
      }
      if (!dbase) {
        dbase = db.db('local')
      }
      $('.hd').each((index, item) => {
        let insertData = {
          "movieName": $(item).find('.title').html(),
          "rank": (pageNum - 1) * 10 + +index + 1
        }
        dbase.collection('test').insertOne(insertData)
      })
      pageNum++
      // 
      sendRequest(getUrl(pageNum))
    })
  })
}

const queryOneDataByObjectId = id => {
  MongoClient.connect(dbUrl, {useUnifiedTopology: true}, (err, db) => {
    if (err) {
      console.log(err)
      process.exit(0)
    }
    const dbase = db.db('local')
    dbase.collection('test').find({"_id": ObjectID(id)}).toArray((err, result) => {
      if (err) {
        db.close()
        db = null
        process.exit(0)
      }
      db.close()
    })
  })
}
queryOneDataByObjectId('5f69bc8640396c249c80ec64')
// sendRequest(getUrl(pageNum))