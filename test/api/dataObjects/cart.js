const should = require('should');
const Cart = require('../../../api/dataObjects/cart.js');
const User = require('../../../api/dataObjects/user.js');

describe('dataObjects', () => {

  describe('cart', () => {

    describe('add', () => {
    	let user;
    	let cart;
    	before(async ()=> {
	    	user = new User(true);
	    	await user.removeAll();
	    	await user.create('Moshe Zuchmir','m@m.com','DDD 12 KV', 'dddddddddd');
	    	cart = new Cart();
	    	await cart.removeUser(1)
    	})
    	it('add existing product to cart', async () => {
			let id = 1;
			try {
				await cart.add("Pizza Slice", 3, 1);
			} catch (e) {
				console.log('get e:',e.message);
	    		should.fail('should not get error on adding to chart');
			}
			let amount = await cart.getAmount(1);
			amount.should.equal(60);
    	})
    })
    describe('checkout', () => {
    	let user;
    	let cart;
    	before(async ()=> {
	    	user = new User(true);
	    	await user.removeAll();
	    	await user.create('Moshe Zuchmir','m@m.com','DDD 12 KV', 'dddddddddd');
	    	cart = new Cart();
	    	await cart.removeUser(1)
    	})
    	it('add existing product to cart', async () => {
			let id = 1;
			try {
				await cart.add("Pizza Slice", 3, 1);
				await cart.add("Garlic Bread", 2, 1);
			} catch (e) {
				console.log('get e:',e.message);
	    		should.fail('should not get error on adding to chart');
			}
			let amount = await cart.getAmount(1);
			amount.should.equal(110);
			try {
				let res = await cart.checkout(1);
				console.log('res:', res)
				res.should.equal(2);				
			} catch (e) {
				console.log('checkout e:',e.message);
	    		should.fail('should not get error on checkout');				
			}

    	})
    })

  });
});
