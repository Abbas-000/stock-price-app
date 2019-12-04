/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog'], like: 'false'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.isObject(res.body.stockData);
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.isNumber(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
        });
        done();
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['aap'], like: 'true'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'stockData');
            assert.isObject(res.body.stockData);
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.stock, 'AAP');
            assert.isNumber(res.body.stockData.price);
            assert.isNumber(res.body.stockData.likes);
            assert.isAtLeast(res.body.stockData.likes, 1);
        })
        done();
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['aap'], like: 'true'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'stockData');
            assert.isObject(res.body.stockData);
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.stock, 'AAP');
            assert.isNumber(res.body.stockData.price);
            assert.isNumber(res.body.stockData.likes);
            assert.isAtMost(res.body.stockData.likes, 1);
        })
        done();
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['aap', 'amzn'], like: 'false'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'stockData');
            assert.isArray(res.body.stockData);
            assert.lengthOf(res.body.stockData, 2);
            assert.property(res.body.stockData[0], 'stock');
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.equal(res.body.stockData[0].stock, 'AMZN');
            assert.isNumber(res.body.stockData[0].price);
            assert.isNumber(res.body.stockData[0].rel_likes);
            assert.equal(res.body.stockData[1].stock, 'AAP');
            assert.isNumber(res.body.stockData[1].price);
            assert.isNumber(res.body.stockData[1].rel_likes);
        })
        done();
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['vray', 'dlth'], like: 'true'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'stockData');
            assert.isArray(res.body.stockData);
            assert.lengthOf(res.body.stockData, 2);
            assert.property(res.body.stockData[0], 'stock');
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.equal(res.body.stockData[0].stock, 'DLTH');
            assert.isNumber(res.body.stockData[0].price);
            assert.isNumber(res.body.stockData[0].rel_likes);
            assert.equal(res.body.stockData[1].stock, 'VRAY');
            assert.isNumber(res.body.stockData[1].price);
            assert.isNumber(res.body.stockData[1].rel_likes);
            assert.isAtMost(res.body.stockData[0].rel_likes, 0);
            assert.isAtMost(res.body.stockData[0].rel_likes, 0);
        })
        done();
      });
      
    });

});
