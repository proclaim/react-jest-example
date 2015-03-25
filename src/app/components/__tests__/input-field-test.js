jest.dontMock('../input-field');

describe('InputField', function() {
    it('should not allow any other key except number when in number mode', function() {
        var React = require('react/addons'),
            InputField = require('../input-field'),
            TestUtils = React.addons.TestUtils,
            source;

        var handleChange = function(name, value, isValid) {
            expect(value).toEqual('123');
        };

        // number only
        source = TestUtils.renderIntoDocument(
            <InputField name="NumberOnly" inputType="number" onChange={handleChange} />
        );
        var numberOnlyComponent = TestUtils.findRenderedDOMComponentWithTag(source, 'input');
        TestUtils.Simulate.change(numberOnlyComponent.getDOMNode(), { target: { value: 'a123ab' } });
    });

    it('should filter good and bad email', function() {
        var React = require('react/addons'),
            InputField = require('../input-field'),
            TestUtils = React.addons.TestUtils,
            source;

        var handleChange = function(name, value, isValid) {
            if(name === 'badEmail') {
                console.log(name, value);
                expect(isValid).toEqual(false);
            }
            else if(name === 'goodEmail') {
                console.log(name, value);
                expect(isValid).toEqual(true);
            }
        };

        // bad email
        source = TestUtils.renderIntoDocument(
            <InputField name="badEmail" inputType="email" onChange={handleChange} />
        );
        var badEmail = TestUtils.findRenderedDOMComponentWithTag(source, 'input');
        TestUtils.Simulate.change(badEmail.getDOMNode(), { target: { value: 'a123ab' } });

        // good email
        source = TestUtils.renderIntoDocument(
            <InputField name="goodEmail" inputType="email" onChange={handleChange} />
        );
        var goodEmail = TestUtils.findRenderedDOMComponentWithTag(source, 'input');
        TestUtils.Simulate.change(goodEmail.getDOMNode(), { target: { value: 'mickey@disney.com' } });
    });
});