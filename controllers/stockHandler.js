var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var assert = require('assert');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


function StockHandler() {
  this.insertOrUpdateIfFound = function(ip, stock, likesCount) {
    let singleOrDoubleStock;
    if (Array.isArray(stock)) {
      singleOrDoubleStock = stock;
    } else {
      singleOrDoubleStock = [stock];
    }
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
      assert.equal(null, err);
      const col = client.db('requesters').collection('ips'); 
      col.findOneAndUpdate({ip: ip}, {$setOnInsert: {ip: ip, stock: singleOrDoubleStock, likescount: likesCount}}, {returnOriginal: false, upsert: true}, (e, result) => {
        assert.equal(null, e);
      });
      client.close();
    });
  };
  this.findSingle = function(stock, res) {
    let oneStockLikes = [];
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
      assert.equal(null, err);
      const col = client.db('requesters').collection('ips');
      col.find({ "stock": { $elemMatch: {$all: [stock] } } }).toArray((e, docs) => { 
        assert.equal(null, e);
        for (let i=0; i<docs.length; i++) {
          oneStockLikes.push(docs[i].stock);
        }
        oneStockLikes = oneStockLikes.reduce((acc, val) => acc.concat(val), []);
        oneStockLikes = oneStockLikes.filter(e => e === stock);
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock.toUpperCase()}/quote`, function(e, response, body) {
          let data = JSON.parse(body);
          if (docs.length === 0) {
            res.send({stockData: {stock: data.symbol, price: data.latestPrice, likes: 0}});
          } else {
            res.send({stockData: {stock: data.symbol, price: data.latestPrice, likes: oneStockLikes.length}});
          }
        });
      });
      client.close();
    });
  };
  this.findDouble = function(stock, res) {
    let structure = {stockData: []};
    let stock1 = stock[0];
    let stock2 = stock[1];
    let stock1LikesCount = [];
    let stock2LikesCount = [];
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
      assert.equal(null, err);
      const col = client.db('requesters').collection('ips');
      col.find({}).toArray(function(err, docs) {
        assert.equal(null, err);
        let stocks = [];
        var rel_likes;
        docs.map(obj => stocks.push(obj.stock));
        stocks = stocks.reduce((acc, val) => acc.concat(val), []);
        stock1LikesCount = stocks.filter(e => e == stock1).length;
        stock2LikesCount = stocks.filter(e => e == stock2).length;
        (stock1LikesCount > stock2LikesCount) ? rel_likes = stock1LikesCount - stock2LikesCount : rel_likes = stock2LikesCount - stock1LikesCount;
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock1.toUpperCase()}/quote`, function(e, response, body) {
          let data = JSON.parse(body);
          structure.stockData.push({stock: data.symbol, price: data.latestPrice, rel_likes: rel_likes});
        });
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock2.toUpperCase()}/quote`, function(e, response, body) {
          let data = JSON.parse(body);
          structure.stockData.push({stock: data.symbol, price: data.latestPrice, rel_likes: rel_likes});
        });
        setTimeout(() => res.json(structure), 1500); // made it synch but not the best way
      });
      client.close();
    });
  };
}



module.exports = StockHandler;