var add = require('../src/add.js');
var assert = require('assert');

describe('加法函数的测试', function() {
  it('1 加 1 应该等于 2', function() {
    assert.equal(add.add(1, 1), 2);
  });
  it.skip('should return -1 unless present', function () {
      });
});

class User {
  save(v){
        v()
  }
}
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      console.log(done)
      var user = new User('Luna');
                              user.save(done);
    });
  });
});


describe('hooks', function () {
  before(function () {
        console.log('runs once before the first test in this block')
  });

  after(function () {
        console.log('runs once after the last test in this block')
  });

  beforeEach(function () {
        console.log('runs before each test in this block')
  });

  afterEach(function () {
        console.log('runs after each test in this block')
  });

  });