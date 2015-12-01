/** @jsx React.DOM */

var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

function hello(){
  console.log(variable);
}
var test;
var priceT;
var streetAddress;
var state;
var zip;
var reservationDate
var reservationDuration;
var reservationTime;
var city;

var StripeButton = React.createClass({
    mixins: [ReactScriptLoaderMixin],
    getScriptURL: function() {
        return 'https://checkout.stripe.com/checkout.js';
    },

    statics: {
        stripeHandler: null,
        scriptDidError: false,
    },

    hasPendingClick: false,

    onScriptLoaded: function() {

      console.log("here");

        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_HSPvK9dod2Uhf8JRQJIBP4rW',
                image: './app/gg.png',
                token: function(token) {
                  var url = "/api/payment/chargeToken";
                  var price = priceT;
                  var streetAddress2 = streetAddress;
                  var state2 = state;
                  var zip2 = zip;
                  var reservationDate2 = reservationDate;
                  var reservationDuration2 = reservationDuration;
                  var reservationTime2 = reservationTime;
                  var city2 = city;
                    $.ajax
                    ({
                        url: url,
                        dataType: 'json',
                        type: 'POST',
                        data: {

                            
                            stripeToken: token,
                            price: price,
                            streetAddress: streetAddress2,
                            state: state2,
                            city: city2,
                            zip: zip2,
                            reservationDate: reservationDate2,
                            reservationDuration: reservationDuration2,   
                            reservationTime: reservationTime2
                            
                        },
                        success: function(res) 
                        {
                          
                            console.log("success");
                          

                        }.bind(this),
                        error: function()
                        {
                            console.log("failure");
                        }.bind(this)

                    });

                }
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    },
    showLoadingDialog: function() {

    },
    hideLoadingDialog: function() {

    },
    showStripeDialog: function() {
        priceT = this.props.data.event.Price;
        streetAddress = this.props.data.event.street;
        state = this.props.data.event.state;
        zip = this.props.data.event.zip1;
        reservationDate = this.props.data.event.resDate;
        reservationDuration = this.props.data.event.duration;
        reservationTime = this.props.data.event.resTime;
        city = this.props.data.event.city;

        this.hideLoadingDialog();
        StripeButton.stripeHandler.open({
                name: 'ParkingLot',
                description: this.props.data.event.Address,
                billingAddress: true,
                amount: this.props.data.event.Price,
            });
    },
    onScriptError: function() {
        this.hideLoadingDialog();
        StripeButton.scriptDidError = true;
    },
    onClick: function() {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        } else {
            this.showLoadingDialog();
            this.hasPendingClick = true;
        }
    },
    render: function() {
        return (
            <button onClick={this.onClick}>Place order</button>
        );
    }
});



module.exports = StripeButton;
