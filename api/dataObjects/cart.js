const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(process.env.PWD + '/pizza-delivery.db');
const Product = require('../dataObjects/product.js');
const Stripe = require('../helpers/stripe.js');
const User = require('../dataObjects/user.js');

class Cart {
	constructor(test) {
		this.test = test;		
		if (test) {
			db = new sqlite3.Database(process.env.PWD + '/pizza-delivery-test.db');			
		}
	}

	add(product, quantity, userId) {
		return new Promise((resolve, reject) => {
			if (!product || !Product.exists(product)) {
				return reject (new Error('Product does not exists'));
			}
			if (!quantity || quantity < 1) {
				return reject (new Error('Quantity must be over 0'));	
			}
			let productPrice = Product.getPrice(product);
			const stmt = db.prepare("INSERT INTO pizza_cart (userId, productName, quantity, amount) VALUES (?,?,?,? )");
			stmt.run([userId, product, quantity, quantity * productPrice], (err) => {
				if (err) {
			  		console.log(err);
			  		stmt.finalize();
			  		return reject(err);
			  	}
			  	stmt.finalize();
			  	resolve(stmt.lastID);
			});
		  
		});
	}

	getAmount(userId) {
		return new Promise((resolve, reject) => {
			let isResolved = false;
			const stmt = db.prepare("select sum(amount) amount FROM pizza_cart where userId = ?");
			stmt.each([userId], (err, row) => {
				if (err) {
			  		console.log(err);
			  		stmt.finalize();
			  		return reject(err);
			  	}
			  	isResolved=true;
			  	resolve(row.amount);
			  	stmt.finalize();
			});
		  
		});

	}
	removeUser(userId) {
		return new Promise((resolve, reject) => {
			const stmt = db.prepare("DELETE FROM pizza_cart where userId = ?");
			stmt.run([userId], (err) => {
				if (err) {
			  		console.log(err);
			  		stmt.finalize();
			  		return reject(err);
			  	}
			  	stmt.finalize();
			  	resolve(stmt.lastID);
			});
		  
		});

	}
	checkout(userId) {
		return new Promise( async (resolve, reject) => {
			let amount = await this.getAmount(userId);
			let userObj = new User();
			let user = await userObj.get(userId);
			console.log(user);
			let result = await Stripe.charge(amount, user.email_address);
			if (result) {
				const stmt = db.prepare("INSERT INTO pizza_order(userId, productName, quantity, amount ) select  userId, productName, quantity, amount from pizza_cart where userId = ?");
				stmt.run([userId], async (err) => {
					if (err) {
				  		console.log(err);
				  		stmt.finalize();
				  		return reject(err);
				  	}
				  	await this.removeUser(userId);
				  	resolve(stmt.changes);
				  	stmt.finalize();
				});				
			} else {
				reject(-1);
			}
		  
		});

	}
}
module.exports = Cart;