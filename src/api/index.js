const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();
const axios = require("axios");
const Product = require('../models/Product');
const headers = {
  'authority': 'scrapeme.live',
  'dnt': '1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'sec-fetch-site': 'none',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-user': '?1',
  'sec-fetch-dest': 'document',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  }
router.get('/page', (req, res) => {

  //get data from requestion of client
  var data = req.query;
  var source = data.source;
  var category = data.category;
  var limit = data.limit;

  //site url of scraping
  const site_url = 'https://' + source;
  axios.get(site_url, Headers=headers)
    .then(function (html) {
      console.log(html.data);
      //category scraping of site
      const $ = cheerio.load(html.data);

      //category items
      var cate_items = $('.headline');
      var keyword = "";
      var keyHtml;
      cate_items.each(
        function (idx, cate_item) {
          if ($(cate_item).text().includes(category)) {
            keyword = $(cate_item).text();
            keyHtml=cate_item
          }
        })
      const category_url=site_url+$(keyHtml.parent.next.next.children[0]).attr('href');
      axios.get(category_url).then(function (sub_html) {
        var result = [];
        const $$ = cheerio.load(sub_html.data);
        const search_items = $$('.s-result-item');
        const length = search_items.length;
        if (length > limit) {
          for (var i = 0; i < parseInt(limit) + 2; i++) {
            const $$$ = cheerio.load($$(search_items[i]).html())
            var sub_result = {}
            if (sub_result.description = $$$('h2').text() != "") {
              sub_result.description = $$$('h2').text();
              sub_result.src = $$$('img').attr("src");
              sub_result.reviewCount = $$$(".a-icon-alt").text();
              sub_result.title = category;
              result.push(sub_result);
            }
          }
        }
        //save data into database
        const product=result.map(res=>new Product(res).save())
        Promise.all(product).then(response=>{
          res.status(200).json({
            success: true,
            data: result
          })
        })
      }).catch(function (err) {
        res.status(200).json({
          success: false,
          data: "Insert category data correctly!"
        })
      });
    })
    .catch(function (err) {
      res.status(200).json({
        success: false,
        data: "Insert source data correctly!"
      })
    });
});


module.exports = router;
