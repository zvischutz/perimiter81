const should = require('should');
const User = require('../../../api/dataObjects/user.js');

describe('dataObjects', () => {

  describe('user', () => {

    describe('get user', () => {
    	let user;
    	before(()=> {
	    	user = new User(true);
	    	user.removeAll();
    	})
    	it('get non existent id', async () => {
			let id = 100;
			try {
				let userData = await user.get(id, true);
				should.not.exists(userData);
			} catch (e) {
				console.log('get e:',e.message);
	    		should.fail('should not get error on getting data back');
			}
    	})
    })

    describe('create user', () => {
    	let user;
    	before(()=> {
	    	user = new User(true);
	    	user.removeAll();
    	})
    	it('should do a simple insert', async () => {
	    	let x;
	    	try {
	    		x = await user.create('Zvi Schutz', 'zvi.schutz@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(x);
			x.should.be.above(0);    	
    	})
    	
    	it('should do a simple insert and check actual values', async () => {
	    	let x;
	    	try {
	    		x = await user.create('Zvi Schutz2', 'zvi.schutz2@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    		should.fail('should not get error on insert');
	    	}
	    	should.exists(x);
			x.should.be.above(0);    	
			try {
				let userData = await user.get(x);
				should.exists(userData);
				userData.name.should.equal('Zvi Schutz2');
				userData.email_address.should.equal('zvi.schutz2@gmail.com');
				userData.username.should.equal('zvi.schutz2@gmail.com');
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}
    	})
    	it('should fail on password too short', async () => {
	    	let x;
	    	try {
	    		x = await user.create('Zvi Schutz3', 'zvi.schutz3@gmail.com', 'Dishon 14 Kfar Vradim', 'veryni' );
	    	} catch (e) {
	    		should.exists(e);
	    		e.message.should.containEql('Password too short');
	    		return;
	    	}
	    	should.fail('Should not succeed in inserting')
    	})
    	it('should fail on blank name', async () => {
	    	let x;
	    	try {
	    		x = await user.create('', 'zvi.schutz4@gmail.com', 'Dishon 14 Kfar Vradim', 'veryniddd' );
	    	} catch (e) {
	    		should.exists(e);
	    		e.message.should.containEql('Name must be passed');
	    		return;
	    	}
	    	should.fail('Should not succeed in inserting')
    	})
    });
    describe('update user', () => {
    	let user;
    	before(()=> {
	    	user = new User(true);
	    	user.removeAll();
    	})
    	it('should do a simple update', async () => {
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz6', 'zvi.schutz6@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			let updId
	    	try {
	    		updId = await user.update(newId, {name: 'Dan Schwartz'} );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(updId);
			newId.should.be.equal(updId);    	
			try {
				let userData = await user.get(updId);
				should.exists(userData);
				userData.name.should.equal('Dan Schwartz');
				userData.email_address.should.equal('zvi.schutz6@gmail.com');
				userData.username.should.equal('zvi.schutz6@gmail.com');
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}


    	});
    	it('should do a password update', async () => {
    		let oldPassword ;
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz7', 'zvi.schutz7@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			try {
				let userData = await user.get(newId);
				should.exists(userData);
				oldPassword = userData.hashed_password;
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}

			let updId
	    	try {
	    		updId = await user.update(newId, {name: 'Dan Schwartz', password: 'VeryVeryNicePassword'} );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(updId);
			newId.should.be.equal(updId);    	
			try {
				let userData = await user.get(updId);
				should.exists(userData);
				userData.name.should.equal('Dan Schwartz');
				userData.email_address.should.equal('zvi.schutz7@gmail.com');
				userData.username.should.equal('zvi.schutz7@gmail.com');
				oldPassword.should.not.be.equal(userData.hashed_password);
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}
    	});
    	it('should do a password update and an email update', async () => {
    		let oldPassword ;
    		let oldUsername;
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz9', 'zvi.schutz9@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			try {
				let userData = await user.get(newId);
				should.exists(userData);
				oldPassword = userData.hashed_password;
				oldUsername = userData.username;
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}

			let updId
	    	try {
	    		updId = await user.update(newId, {name: 'Dan Schwartz', password: 'VeryVeryNicePassword', emailAddress: 'zzzz@gmail.com'} );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(updId);
			newId.should.be.equal(updId);    	
			try {
				let userData = await user.get(updId);
				should.exists(userData);
				userData.name.should.equal('Dan Schwartz');
				userData.email_address.should.equal('zzzz@gmail.com');
				userData.username.should.equal('zzzz@gmail.com');
				oldPassword.should.not.be.equal(userData.hashed_password);
			} catch (e) {
				console.log('get e:',e);
	    		should.fail('should not get error on getting data back');
			}
    	});
    })
    describe('delete user', () => {
    	let user;
    	before(()=> {
	    	user = new User(true);
	    	user.removeAll();
    	})
    	it('should do a simple delete', async () => {
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz8', 'zvi.schutz8@gmail.com', 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			let deletedId;
	    	try {
	    		deletedId = await user.delete(newId);
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(deletedId);
			newId.should.be.equal(deletedId);    	
			try {
				let userData = await user.get(newId);
				should.not.exists(userData);
			} catch (e) {
				console.log('get e:',e.message);
	    		should.fail('should not get error on getting data back');
			}
		});
    });
    describe('login-logout user', () => {
    	let user;
    	before(()=> {
	    	user = new User(true);
	    	user.removeAll();
    	})
    	it('should do a login', async () => {
    		let username = 'zvi.schutz8@gmail.com';
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz8', username , 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			let login = await user.login(username, 'verynicepassword');
			login.should.equal(true);
			user.isLogin(username).should.equal(true);
		})
    	it('should fail a  login', async () => {
    		let username = 'zvi.schutz9@gmail.com';
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz9', username , 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			let login = await user.login(username, 'verynicepasswordddd');
			login.should.equal(false);
			user.isLogin(username).should.equal(false);
		})
    	it('should do a login and than a logout', async () => {
    		let username = 'zvi.schutz10@gmail.com';
	    	let newId;
	    	try {
	    		newId = await user.create('Zvi Schutz10', username , 'Dishon 14 Kfar Vradim', 'verynicepassword' );
	    	} catch (e) {
	    		console.log('e:', e);
	    	}
	    	should.exists(newId);
			newId.should.be.above(0);    	
			let login = await user.login(username, 'verynicepassword');
			login.should.equal(true);
			user.isLogin(username).should.equal(true);
			user.logout(username)
			user.isLogin(username).should.equal(false);
		})
    });
  });
});
