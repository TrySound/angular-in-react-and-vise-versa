import angular from 'angular';
import React from 'react';
import ReactDOM from 'react-dom';
import contextTypes from './contextTypes.js';

const withContext = context => component => {
    class wrapped extends React.Component {
        getChildContext() {
            return context;
        }
        render() {
            return React.createElement(component, this.props);
        }
    }
    wrapped.childContextTypes = contextTypes;
    return wrapped;
}

const renderReactInAngular = (name, component, keys = []) => {
    const bindings = keys.reduce((acc, key) => {
        acc[key] = '<';
        return acc;
    }, {});
    class Controller {
        constructor($element, $rootScope, $compile) {
            this.element = $element[0];
            this.wrappedComponent = withContext({ $rootScope, $compile })(component);
        }

        $onChanges() {
            const props = keys.reduce((acc, key) => {
                acc[key] = this[key];
                return acc;
            }, {});
            ReactDOM.render(React.createElement(this.wrappedComponent, props), this.element);
        }

        $onDestroy() {
            ReactDOM.unmountComponentAtNode(this.element);
        }
    }
    return angular.module(name, []).component(name, {
        bindings,
        controller: ['$element', '$rootScope', '$compile', Controller]
    }).name;
};

export default renderReactInAngular;
