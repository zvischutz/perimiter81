"use strict"

const User = require('../dataObjects/user.js');
const Product = require('../dataObjects/product.js');

const getAllProducts = (req, res) => {
	const username = req.swagger.params.username.value ;
	if (new User().isLogin(username)) {
		res.json(Product.getAll());
	} else {
		res.json({})
	}

}
module.exports = {
	getAllProducts: getAllProducts
}