/** @jsx React.DOM */

'use strict';

var React = require('react'),
    Input = require('./components/input-field'),
    ExampleApp;

ExampleApp = React.createClass({
    render: function() {
        return (
        	/*jshint ignore:start */
            <div className="container">
            	<h2>Hello, World</h2>
                <Input name="numberOnly" label="Number only input" inputType="number" />
                <Input name="email" label="Email" inputType="email" />
            </div>
            /*jshint ignore:end */
        );
    }
});

React.render(
    /*jshint ignore:start */
    <ExampleApp />,
    /*jshint ignore:end */
    document.getElementById('app')
);
