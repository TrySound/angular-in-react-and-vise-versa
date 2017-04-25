import angular from 'angular';
import React from 'react';
import ReactDOM from 'react-dom';
import { withContext } from 'recompose';
import contextTypes from './contextTypes.js';

const renderReactInAngular = (name, component, keys = []) => {
    const bindings = keys.reduce((acc, key) => {
        acc[key] = '<';
        return acc;
    }, {});
    class Controller {
        constructor($element, $rootScope, $compile) {
            this.element = $element[0];
            this.wrappedComponent = withContext(contextTypes, () => ({ $rootScope, $compile }))(component);
        }
        $onChanges() {
            const props = keys.reduce((acc, key) => {
                acc[key] = this[key];
                return acc;
            }, {});
            ReactDOM.render(React.createElement(this.wrappedComponent, props), this.element);
        }
    }
    return angular.module(name, []).component(name, {
        bindings,
        controller: ['$element', '$rootScope', '$compile', Controller]
    }).name;
};

export default renderReactInAngular;
