const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(process.env.PWD + '/pizza-delivery.db');
const crypto = require('crypto');
const loginUsers = {}
class User {
	constructor(test) {
		this.test = test;	
		if (test) {
			db = new sqlite3.Database(process.env.PWD + '/pizza-delivery-test.db');			
		}	
	}
	removeAll() {
		if (!this.test) {
			return; // Only run it on testing
		}
		return new Promise((resolve, reject) => {
		const stmt = db.prepare("delete from pizza_user;");
		stmt.all([], (err, rows) => {
		  	if (err) {
		  		console.log(err);
		  		stmt.finalize();
		  		return reject(err);
		  	}
		  	resolve(true);
		  	stmt.finalize();
		  });
		  
		});
	}
	create(name, emailAddress, streetAddress, password) {
		return new Promise((resolve, reject) => {
			if (!password || password.length < 8) {
				return reject (new Error('Password too short'));
			}
			if (!name || name.length < 1) {
				return reject (new Error('Name must be passed'));	
			}
			/* A regexp email validation should be used here */
			if (!emailAddress || emailAddress.length < 2 || !emailAddress.includes('@')) {
				return reject (new Error('Email must be passed and contain more than 1 letter and a @'));	
			}

			let hashedPassword = crypto.createHash('md5').update(password).digest("hex");
			const stmt = db.prepare("INSERT INTO pizza_user (name, email_address, street_address, username, hashed_password) VALUES (?,?,?,?,? )");
			stmt.run([name, emailAddress, streetAddress, emailAddress, hashedPassword], (err) => {
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
	getByUsername(username) {
		return new Promise((resolve, reject) => {
	      let somethingFound=false;
		  const stmt = db.prepare("select rowid,* from pizza_user where username = ?");
		  stmt.each([username], (err, row) => {
		  	if (err) {
		  		console.log(err);
		  		return reject(err);
		  	}

		  	row.id = row.rowid;
		  	delete row.rowid;
		  	somethingFound = true;
		  	resolve(row);
		  }, (err) => {
		  	stmt.finalize();
		  	if (!somethingFound) {
		  		resolve();
		  	}
		  });
		  
		});
	}
	get(id) {
		return new Promise((resolve, reject) => {
	      let somethingFound=false;
		  const stmt = db.prepare("select rowid,* from pizza_user where rowid = ?");
		  stmt.each([id], (err, row) => {
		  	if (err) {
		  		console.log(err);
		  		return reject(err);
		  	}

		  	row.id = row.rowid;
		  	delete row.rowid;
		  	somethingFound = true;
		  	resolve(row);
		  }, (err) => {
		  	stmt.finalize();
		  	if (!somethingFound) {
		  		resolve();
		  	}
		  });
		  
		});
	}
	update(id, data) {
		return new Promise((resolve, reject) => {
			let setParams = [];
			if (data.password && data.password.length > 8) {
				let hashedPassword = crypto.createHash('md5').update(data.password).digest("hex");
				setParams.push(`hashed_password='${hashedPassword}'`);
			}
			if (data.name && data.name.length > 1) {
				setParams.push(`name='${data.name}'`);	
			}

			if (data.emailAddress && data.emailAddress.length > 2 && data.emailAddress.includes('@')) {
				setParams.push(`email_address='${data.emailAddress}'`);	
				setParams.push(`username='${data.emailAddress}'`);	
			}
			if (setParams.length == 0) {
				return reject(new Error('No params to update'));
			}
			const stmt = db.prepare(`UPDATE pizza_user set ${setParams.join(',')} WHERE rowid = ?`);
			stmt.run([id], (err) => {
				if (err) {
			  		console.log(err);
			  		stmt.finalize();
			  		return reject(err);
			  	}
			  	stmt.finalize();
			  	resolve(stmt.changes == 1 ? id : null);
			});		  
		});
	};

	delete(id) {
		return new Promise((resolve, reject) => {
		  const stmt = db.prepare("delete from pizza_user where rowid = ?");
		  stmt.run([id], (err) => {
		  	if (err) {
		  		console.log(err);
		  		stmt.finalize();
		  		return reject(err);
		  	}
		  	resolve(stmt.changes == 1 ? id : null);
		  	stmt.finalize();
		  });
		});
	}
	login(username, password) {
		return new Promise(async (resolve, reject) => {			
			let user = await this.getByUsername(username);
			let hashedPasswordSuppliedByUser = crypto.createHash('md5').update(password).digest("hex");
			if (user && user.hashed_password === hashedPasswordSuppliedByUser) {
				loginUsers[username] = new Date();
				resolve(true);
			} else {
				resolve(false);	
			}
		});
	}

	logout(username) {
		delete loginUsers[username];
	}
	
	isLogin(username) {
		return (loginUsers[username] || 0) > 0;
	}
}
module.exports = User;