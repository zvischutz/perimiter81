const products = [
	{name: "Pizza Slice",price: 20, onStock: true},
	{name: "Family Pizza",price: 50, onStock: true},
	{name: "1.5 Liter Coca Cola", price: 10, onStock: true},
	{name: "Garlic Bread", price: 25, onStock: false}
]
const _ = require('lodash');
class Product {
	static getAll() {
		return products;
	}

	static exists(productName) {
		return _.find(products, product => product.name === productName) !== null;
	}

	static getPrice(productName) {
		let product = _.find(products, product => product.name === productName);
		return product ? product.price : 0;
	}
}
module.exports = Product;