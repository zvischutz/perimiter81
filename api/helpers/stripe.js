const axios = require('axios');
const STIPE_TOKEN = 'sk_test_51IreffEuUqdzQRTrhClS3CIl7FmOocDvo3erm0JSo11Lp8AT6zkhOV5PmOjVlql55PHZnOXS8zn5h6FDH0NfV0Yv00jWCP0RSI';
const STRIPE_URL = 'https://api.stripe.com/v1/';
class Stripe {
	static async charge(amount, email) {
		const params = new URLSearchParams()
		params.append('amount',amount*100);
		params.append('receipt_email',email);
		params.append('confirm', 'true');
		params.append('currency','usd');
		params.append('payment_method_types[]', 'card');
		params.append('payment_method', 'pm_card_visa')

		let result ;
		try {
			result = await axios.post(STRIPE_URL+'payment_intents', params, {
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				auth: {username: STIPE_TOKEN, password: ''}
			})
		} catch (e) {
			if (e.response && e.response.data) {
				console.log(e.response.data.error);	
			}
			return false;			
		}

		return result && result.data && result.data.status === 'succeeded';
	}
}

module.exports = Stripe;