var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
// <nav class="navbar navbar-default navbar-fixed-top">
//        <div class="nav navbar-nav navbar-left">
//          <a class="navbar-brand" href="#"> <img alt="Brand" src="oneup.png"> </a>
//          <a class="navbar-brand" href="#">Home</a>
//          <a class="navbar-brand" href="#">About Us</a>
//          <a class="navbar-brand" href="#">FAQ</a>
//        </div>
//        <div class="nav navbar-nav navbar-right">
//            <a class="navbar-brand" style="float:right" href="#">Log in</a>
//            <a class="navbar-brand" style="float:right" href="#">Sign up</a>
//          </div>
//      </nav>
var App = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
          
              <div className="nav navbar-nav navbar-left">
                <a className="navbar-brand" href="/">Home</a>
                <a className="navbar-brand" href="/">About Us</a>
                <a className="navbar-brand" href="/">FAQ</a>

              </div>
              <div className="nav navbar-nav navbar-right" id="bs-example-navbar-collapse-1">
                <a className="navbar-brand" href="/">Log in</a>
                
                <li>
                <Link to="page">Sign up</Link>
                </li>
                
              </div>
            
        </nav>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>Put your home page here</p>
      </div>
    );
  }
});

var Page = React.createClass({
  render: function() {
    return (
      <div>
      <p> Hello! sign up here!</p>
      </div>
    );
  }
});


// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App}>
          <Route name="page" path="/page" component={Page} />
          <Route path="*" component={Home}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.body);

