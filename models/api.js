var app = require('./express.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));
var User = require('./user.js');

app.post
('/api/users/register', 
	function (req, res) 
	{
		console.log("email: " + req.body.email);
		console.log("username: " + req.body.username);
		User.findOrCreate({username: req.body.username}, 
		function(err, user, created) 
		{
	        if (created) 
	        {
	            // if this username is not taken, then create a user record
	            user.name = req.body.name;
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
				        res.json({username: user.username, token: token});
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
            // return value is JSON containing user's name and token
            //localStorage.token = token;
            //console.log(req.body.username);
            res.json({username: req.body.username, token: token});
            //console.log(token);
        } 
        else 
        {
            res.sendStatus(403);
        }
    });
});










