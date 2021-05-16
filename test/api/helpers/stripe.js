const should = require('should');
const Stripe = require('../../../api/helpers/stripe.js');

describe('helpers', () => {

  describe('stripe', () => {

    describe('charge', async () => {
    	it('add payment to stripe', async () => {
    		let stripeResult;
			try {
				stripeResult = await Stripe.charge(100, 'zvi.schutz12@gmail.com')
			} catch (e) {
				console.log('get e:',e.message);
	    		should.fail('should not get error on stripe payment');
			}
			stripeResult.should.equal(true);
    	})
    })

  });
});
