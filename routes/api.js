/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var StockHandler = require('../controllers/stockHandler');


var stockHandler = new StockHandler();

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const ip = req.ip;
      let likesCount = null;
      let { stock, like } = req.query;
      (like === "true") ? likesCount = 1 : likesCount = 0;
      if (Array.isArray(stock)) {
        // multiple stock code from here
        if (like === 'true') {
          stockHandler.insertOrUpdateIfFound(ip, stock, likesCount);
          stockHandler.findDouble(stock, res);
        } 
        if (like === 'false') {
          stockHandler.findDouble(stock, res);
        }
      } else {
        // single stock code from here
        if (like === 'false') {
          stockHandler.findSingle(stock, res);
        }
        if (like === 'true') {
          stockHandler.insertOrUpdateIfFound(ip, stock, likesCount);
          stockHandler.findSingle(stock, res);
        }
      }
    });
};
