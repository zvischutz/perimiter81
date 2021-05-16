'use strict';
const util = require('util');
const User = require('../dataObjects/user.js')
const Cart = require('../dataObjects/cart.js')

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */ 
const getUser = async (req, res) => {
  const userId = req.swagger.params.id.value ;
  try {
	  let user = new User();
	  let userDetails = await user.get(parseInt(userId));
	  if (userDetails) {
	  	res.json({id: parseInt(userId), name: userDetails.name, emailAddress: userDetails.email_address, streetAddress: userDetails.street_address, username: userDetails.username});  	
	  } else {
	  	res.status(404);
	  	res.json({error: 'No user with id:' + userId});
	  }
  } catch (e) {
	res.status(500).json({error: e.message});  	
  }
}

const createUser = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  try {
	  let newId = await user.create(userParam.name, userParam.email_address, userParam.street_address, userParam.password);
	  res.status(201).json({id: newId});
  } catch (e) {
  	res.status(500).json({error: e.message});
  }
}

const updateUser = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  try {
	let updId = await user.update(userParam.id, {name: userParam.name, emailAddress: userParam.email_address, 
		streetAddress: userParam.street_address, password: userParam.password});
	if (updId) {
		res.status(201).json({id: updId});
	} else {
		res.status(404);
		res.json({error: 'Id ' + userParam.id + ' not found'})		
	}
  } catch (e) {
  	res.status(500).json({error: e.message});
  }
}

const deleteUser = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  try {
	let delId = await user.delete(userParam.id);
	if (delId) {
		res.status(201).json({id: delId});
	} else {
		res.status(404);
		res.json({error: 'Id ' + userParam.id + ' not found'})
	}
  } catch (e) {
  	res.status(500).json({error: e.message});
  }
}

const loginUser = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  try {
  	let login = await user.login(userParam.username, userParam.password);
  	if (login) {
  		res.json({message: 'Successfull Login'});
  	} else {
  		res.status(403);
  		res.json({error: 'username not exists or invalid password ' })
  	}
  } catch (e) {
  	res.status(500).json({error: e.message});
  }
}

const logoutUser = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  try {
	let login = await user.logout(userParam.username);
	res.json({message: 'Successfull Logout'});
  } catch (e) {
  	res.status(500).json({error: e.message});
  }
}

const isLogin = (req, res) => {
  const userParam = req.body ;
  let user = new User();
  let isLoginResponse = user.isLogin(userParam.username);
  console.log('res:', isLoginResponse)
  res.json({isLogin: isLoginResponse});
}

const addToCart = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  let cart = new Cart();
  try {
    if (user.isLogin(userParam.username)) {
      let userDetails = await user.getByUsername(userParam.username);
      if (userDetails.id) {
        let newCartId = await cart.add(userParam.productName, userParam.quantity, userDetails.id);
        if (newCartId > 0) {
          res.status(201).json({message: 'Added successfully to cart'});      
        } else {
          res.status(500).json({error: 'Something went wrong while adding cart row!'})  
        }
      } else {
        res.status(500).json({error: 'User is logged in but do not exists in db , something is wrong!'})  
      }
    } else {
      res.status(400).json({error: 'User is not logged in'})
    }
  } catch (e) {
    res.status(500).json({error: e.message});
  }
}

const checkout = async (req, res) => {
  const userParam = req.body ;
  let user = new User();
  let cart = new Cart();
  try {
    if (user.isLogin(userParam.username)) {
      let userDetails = await user.getByUsername(userParam.username);
      if (userDetails.id) {
        let howManyItems = await cart.checkout(userDetails.id);
        if (howManyItems > 0) {
          res.status(201).json({message: 'Checkout successfully'});      
        } else {
          res.status(400).json({error: 'No items to checkout'})  
        }
      } else {
        res.status(500).json({error: 'User is logged in but do not exists in db , something is wrong!'})  
      }
    } else {
      res.status(400).json({error: 'User is not logged in'})
    }
  } catch (e) {
    res.status(500).json({error: e.message});
  }
}

module.exports = {
  get: getUser,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  login: loginUser,
  logout: logoutUser,
  isLogin: isLogin,
  addToCart: addToCart,
  checkout: checkout
};
