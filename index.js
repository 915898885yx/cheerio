const cheerio = require('cheerio')
const request = require('request')
let pageNum = 1
let resultList = []
const getUrl = (pageNum) => `https://movie.douban.com/top250?start=${(pageNum - 1) * 25}&filter=`
const sendRequest = (url) => {
  request(url, {}, (req, res) => {
    const {body} = res
    const $ = cheerio.load(body, { decodeEntities: false })
    if ($('.hd').length  <= 0) {
      return resultList.forEach(item => {console.log(item)})
    }
    pageNum++
    $('.hd').each((_, item) => {
      resultList.push($(item).find('.title').html())
    })
    sendRequest(getUrl(pageNum))
  })
}
sendRequest(getUrl(pageNum))