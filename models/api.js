var app = require('./express.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));


var User = require('./user.js');
var order = require('./order.js');
var url = 'mongodb://localhost:27017/list';
var driveway = require('./driveway.js');
var reservation = require('./reservation.js');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

app.post
('/api/users/updateDriveway',
	function(req, res)
	{
		driveway.update({_id: req.body._id}, {address: req.body.address, numCars: req.body.numCars,
											  city: req.body.city, zip: req.body.zip, state: req.body.state,
											  times: req.body.times, fee: req.body.fee},
		function(err, driveway)
		{
			if(driveway)
				res.json({driveway: driveway});
			else
				res.sendStatus('403');
		});
	}
);
app.post
('/api/users/queryID',
	function(req, res)
	{
		driveway.find({_id: req.body._id},
		function(err, driveway)
		{
			if(driveway)
				res.json({driveway: driveway});
			else
				res.sendStatus('403');
		});
	}
);

app.post
('/api/users/getDriveways',
	function (req, res)
	{
		driveway.find({username: req.body.username},
		function(err, driveway)
		{
			if (driveway)
				res.json({driveway: driveway});
			else
				res.sendStatus("403");
		});
	}
);
app.post
('/api/users/deleteDriveway',
	function (req, res)
	{
		driveway.remove({_id: req.body._id},
		function(err, driveway)
		{
			if (driveway)
				res.json({driveway: driveway});
			else
				res.sendStatus("403");
		});
	}
);
app.post
('/api/users/getAllDriveways',
	function (req, res)
	{
		driveway.find({},
		function(err, driveway)
		{
			if (driveway)
				res.json({driveway: driveway});
			else
				res.sendStatus("403");
		});
	}
);
app.post
('/api/users/addDriveway',
	function (req, res)
	{
		driveway.findOrCreate({
			username: req.body.username, address: req.body.address, zip: req.body.zip, 
			city: req.body.city, state: req.body.state, numCars: req.body.numCars, 
			times: req.body.times, fee: req.body.fee},
		
		function(err, driveway, created)
		{
			if (created)
			{
				driveway.address = req.body.address;
				driveway.username = req.body.username;
				driveway.zip = req.body.zip;
				driveway.city = req.body.city;
				driveway.times = req.body.times;
				driveway.fee = req.body.fee;
				driveway.save
				(
					function(err)
					{
						if(err)
						{
							res.sendStatus("403");
							return;
						}
						res.json({username: driveway.username, address: driveway.address, zip: driveway.zip, times: driveway.times});
					}
				);
			}
			else if(driveway)
				res.json({username: 'already exists'});
			else
				res.sendStatus("403");
		});
	}
);
app.post
('/api/users/register', 
	function (req, res) 
	{
		User.findOrCreate({username: req.body.username, email: req.body.email}, 
		function(err, user, created) 
		{
	        if (created) 
	        {
	            // if this username is not taken, then create a user record
	            user.name = req.body.name;
	            user.email = req.body.email;
	            user.set_password(req.body.password);
	            user.save
	            (
	            	function(err) 
		        	{	
						if (err) 
						{
						    res.sendStatus("403");
						    return;
						}
				                // create a token
						var token = User.generateToken(user.username);
				                // return value is JSON containing the user's name and token
				        res.json({username: user.username, email: user.email, token: token});
		        	}
		       	);
	        } 
	        else 
	        {
	            // return an error if the username is taken
	            res.sendStatus("403");
	        }
	    });
	}
);

app.post
('/api/users/addReservation',
	function (req, res)
	{
		reservation.findOrCreate({drivewayId: req.body.drivewayId, date: req.body.resDate, buyer: req.body.buyer},
		function(err, reservation, created)
		{
			if (created)
			{
				reservation.buyer = req.body.buyer;
				reservation.owner = req.body.owner;
				reservation.drivewayId = req.body.drivewayId;
				reservation.date = req.body.resDate;
				reservation.time = req.body.resTime;
				reservation.save
				(
					function(err)
					{
						if(err)
						{
							res.sendStatus("403");
							return;
						}
						res.json({drivewayId: req.body.drivewayId});
					}
				);
			}
			else
				res.sendStatus("403");
		});
	}
);

app.post('/api/users/login', function (req, res) 
{
    // find the user with the given username
    User.findOne({username: req.body.username}, function(err,user) 
    {
		if (err) 
		{
		    res.sendStatus(403);
		    return;
		}
        // validate the user exists and the password is correct 
        if (user && user.checkPassword(req.body.password)) 
        {
            // create a token
            var token = User.generateToken(user.username);
            res.json({username: req.body.username, email: user.email, token: token});
            //console.log(token);
        } 
        else 
        {
            res.sendStatus(403);
        }
    });
});

app.post('/api/payment/chargeToken', function (req, res) 
{
	console.log("entered api! charge");
    // find the user with the given username
    var stripe = require("stripe")("sk_test_AYUBJ4KoeKWRDh0mGGScSTvh");
    stripe.setApiVersion('2015-10-16');

	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form
	var stripeToken = req.body.stripeToken;
	var tPrice = req.body.tPrice;
	console.log(tPrice);
	console.log("----------");
	console.log(stripeToken);

	var charge = stripe.charges.create({
	  amount: 1000, // amount in cents, again
	  currency: "usd",
	  source: stripeToken.id,
	  description: "Example charge"
	}, function(err, charge) {
	  if (err && err.type === 'StripeCardError') {
	    console.log("error");
	  }
	  else{
	  	console.log("in here");
	  	console.log(stripeToken.id);
	  	order.findOrCreate({email: stripeToken.email, last4: stripeToken.card.last4, tokenid: stripeToken.id},
	  	function(err, order, created)
	  	{
	  		if(created)
	  		{
	  			order.email = stripeToken.email;
	  			order.last4 = stripeToken.card.last4;
	  			order.name1 = stripeToken.card.name;
	  			order.address = req.body.streetAddress;
	  			order.city = req.body.city;
	  			order.state = req.body.state;
	  			order.zip = req.body.zip;
	  			order.price = req.body.price;
	  			order.reservationDate = req.body.reservationDate;
	  			order.reservationDuration = req.body.reservationDuration;
	  			order.reservationTime = req.body.reservationTime;
	  			order.stripeTokenId = stripeToken.id;
	  			order.cardType = stripeToken.card.brand;
	  			order.save
	  			(
	  				function(err)
	  				{
	  					if(err)
	  					{
	  						res.sendStatus("403");
	  						return;
	  					}

	  					res.json({tokenId: stripeToken.id});
	  				}
	  			);
	  		}
	  		else
	  			res.sendStatus("403");

	  	});
	  	
	  }
	});
});












