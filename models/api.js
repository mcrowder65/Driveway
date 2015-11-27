var app = require('./express.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));


var User = require('./user.js');
var url = 'mongodb://localhost:27017/list';
var driveway = require('./driveway.js');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

app.post
('/api/users/getDriveways',
	function (req, res)
	{
		console.log("looking for: " + req.body.username);
		driveway.findOne({username: req.body.username},
		function(err, driveway)
		{
			if (driveway)
			{
				console.log('found something');

				res.json({driveway: driveway});
			}
			else
			{
				console.log('fail');
				res.sendStatus("403");
			}
		});
	}
);
app.post
('/api/users/addDriveway',
	function (req, res)
	{
		console.log('trying to add a driveway');
		console.log("username: " + req.body.username);
		console.log("address: " + req.body.address);
		console.log("zip: " + req.body.zip);
		console.log("state: " + req.body.state);
		console.log("numCars: " + req.body.numCars);
		driveway.create({username: req.body.username, address: req.body.address, zip: req.body.zip, state: req.body.state, numCars: req.body.numCars},
		function(err, driveway)
		{
			if (driveway)
			{
				console.log('created!');
				driveway.address = req.body.address;
				driveway.username = req.body.username;
				driveway.zip = req.body.zip;
				driveway.save
				(
					function(err)
					{
						if(err)
						{
							res.sendStatus("403");
							console.log('first failure spot');
							return;
						}
						res.json({username: driveway.username, address: driveway.address, zip: driveway.zip});
					}
				);
			}
			else
			{
				console.log('second failure spot');
				res.sendStatus("403");
			}
		});
	}
);

app.post
('/api/users/register', 
	function (req, res) 
	{
		console.log("username: " + req.body.username);
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

app.post('/api/users/login', function (req, res) 
{
	console.log("entered api!");
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










