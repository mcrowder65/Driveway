/** @jsx React.DOM */

var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

function hello(){
  console.log(variable);
}

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

        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_HSPvK9dod2Uhf8JRQJIBP4rW',
                image: './app/gg.png',
                email: 'brennen.barney@gmail.com',
                token: function(token) {
                  console.log(token);
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
        this.hideLoadingDialog();
        StripeButton.stripeHandler.open({
                name: 'Demo Site',
                description: '2 widgets ($20.00)',
                billingAddress: true,
                amount: 3000
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