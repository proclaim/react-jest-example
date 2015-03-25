'use strict';

var React = require('react'),
    CX = require('react/lib/cx'),
    InputField;

InputField = React.createClass({

    propTypes: {
            type            : React.PropTypes.oneOf(['default','withIcon']),
            name            : React.PropTypes.string.isRequired,                // identifier for onChange event
            label           : React.PropTypes.string,                           // label to be displayed
            value           : React.PropTypes.string,                           // set value to input field
            iconText        : React.PropTypes.string,                           // text used when using type 2
            iconClassName   : React.PropTypes.string,                           // icon class used when using type 2, if provided, will overwrite icon
            placeholder     : React.PropTypes.string,                           // place holder text
            inputType       : React.PropTypes.string,                           // text || password || number || range || email
            inputSize       : React.PropTypes.string,                           // (empty) || large || small
            required        : React.PropTypes.bool,                             // will have red border when input is empty
            onChange        : React.PropTypes.func.isRequired,                  // will return [ name (string), value(string), 3.isValidInput (bool) ]
            min             : React.PropTypes.number,                           // minimum for range input
            max             : React.PropTypes.number,                           // maxumum for range input
            validationRegex : React.PropTypes.object                            // regular expression for validation
        },
        getDefaultProps: function() {
            return {
                type            : 'default',
                name            : 'input-field',
                label           : '',
                icon            : '',
                iconClassName   : '',
                placeholder     : '',
                inputType       : 'text',
                inputSize       : '',
                required        : false,
                onChnage        : function() {},
                min             : 0,
                max             : 100,
                validationRegex : null
            };
        },
        getInitialState: function() {
            return {
                isValidInput : true
            };
        },
        _matchRequiredRule: function(value) {
            return value !== '';
        },
        _matchEmailRule: function(email) {
            // current email rule is [string]@[string] simple verification
            return email.match(/\S+@\S+/) !== null;
        },
        _handleFieldChange: function(event) {
            var currentInputIsValid = true,
                inputValue = event.target.value;

            if(this.props.validationRegex !== null) {
                currentInputIsValid = inputValue.match(this.props.validationRegex) !== null;
            }
            else {
                switch(this.props.inputType) {
                    case 'email':
                        currentInputIsValid = this._matchEmailRule(event.target.value);
                        break;

                    case 'number':
                        // if user paste in data, strip all none numbers
                        inputValue = event.target.value = event.target.value.replace(/\D/g,'');
                        break;
                }
            }

            if(this.props.required && currentInputIsValid) {
                currentInputIsValid = this._matchRequiredRule(inputValue);
            }

            this.setState({
                isValidInput: currentInputIsValid
            });

            this.props.onChange(this.props.name, inputValue, currentInputIsValid);
        },
        _handleFieldBlur: function(event) {
            this._handleFieldChange(event);
        },
        _handleKeyDown: function(event) {
            // validation for number
            if(this.props.inputType === 'number') {
                // Allow: backspace, delete, tab, escape, enter and .
                if (![46, 8, 9, 27, 13, 110, 190].find(event.keyCode) ||
                    // Allow: Ctrl+A
                    (event.keyCode === 65 && (event.metaKey || event.ctrlKey)) ||
                    // Allow paste (ctrl + V)
                    (event.keyCode === 86 && (event.metaKey || event.ctrlKey)) ||
                    // Allow copy (Ctrl + C)
                    (event.keyCode === 67 && (event.metaKey || event.ctrlKey)) ||
                    // Allow: home, end, left, right, down, up
                    (event.keyCode >= 35 && event.keyCode <= 40)) {
                    // let it happen, don't do anything
                }
                // check for number only
                else if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        },
        _renderDefault: function(inputType, fieldClass, inputClass) {
            var labelHtml = '';
            if(this.props.label) {
                /* jshint ignore:start */
                labelHtml = <label className="control-label" htmlFor={this.props.name}>{this.props.label}</label>;
                /* jshint ignore:end */
            }

            return (
                /* jshint ignore:start */
                <div className={fieldClass}>
                    {labelHtml}
                    <input
                        id          = {this.props.name}
                        type        = {inputType}
                        value       = {this.props.value}
                        className   = {inputClass}
                        placeholder = {this.props.placeholder}
                        onKeyDown   = {this._handleKeyDown}
                        onChange    = {this._handleFieldChange}
                        onBlur      = {this._handleFieldBlur}
                        min         = {this.props.min}
                        max         = {this.props.max} />
                </div>
                /* jshint ignore:end */
            );
        },
        _renderWithIcon: function(inputType, fieldClass, inputClass) {
            var iconHtml = this.props.iconText,
                labelHtml = '',
                contentHtml;

            if(this.props.iconClassName) {
                /* jshint ignore:start */
                iconHtml = <i className={this.props.iconClassName}></i>;
                /* jshint ignore:end */
            }

            if(this.props.labelHtml) {
                /* jshint ignore:start */
                labelHtml = <label className="control-label" htmlFor={this.props.name}>{this.props.label}</label>;
                /* jshint ignore:end */
            }

            /* jshint ignore:start */
            return (
                <div className={fieldClass}>
                    {labelHtml}
                    <div className="input-group">
                        <span className="input-group-addon">{iconHtml}</span>
                        <input
                            id          = {this.props.name}
                            type        = {inputType}
                            value       = {this.props.value}
                            className   = {inputClass}
                            placeholder = {this.props.placeholder}
                            onKeyUp     = {this._handleKeyDown}
                            onChange    = {this._handleFieldChange}
                            onBlur      = {this._handleFieldBlur} />
                    </div>
                </div>
            );
            /* jshint ignore:end */
        },
        render: function() {
            var contentHtml     = '',
                inputType       = '',
                fieldClass,
                inputClass;

            inputType = this.props.inputType == 'number' ? 'text' : this.props.inputType;

            fieldClass = CX({
                'form-group'    : true,
                'has-error'     : !this.state.isValidInput
            });

            inputClass = CX({
                'form-control'  : this.props.inputType != 'range',
                'input-lg'      : this.props.inputSize == 'large',
                'input-sm'      : this.props.inputSize == 'small'
            });

            switch(this.props.type)
            {
                case 'withIcon':
                    contentHtml = this._renderWithIcon(inputType, fieldClass, inputClass);
                    break;

                default:
                    contentHtml = this._renderDefault(inputType, fieldClass, inputClass);
                    break;
            }

            /* jshint ignore:start */
            return (
                <div>
                    {contentHtml}
                </div>
            );
            /* jshint ignore:end */
        }

});

module.exports = InputField;