import angular from 'angular';
import React from 'react';
import renderReactInAngular from './renderReactInAngular.js';
import renderAngularInReact from './renderAngularInReact.js';

const root = document.body.appendChild(document.createElement('app'));

const WrappedAngularComponent = renderAngularInReact('wrappedAngularComponent', [
    'message'
]);

const Cmt = props => (
    React.createElement('div', null,
        React.createElement('div', null, props.message),
        React.createElement(WrappedAngularComponent, { message: 'Hello, Angular!' })
    )
);

const wrappedReactComponent = renderReactInAngular('wrappedReactComponent', Cmt, [
    'message'
]);

var i = 0;

angular.module('app', [wrappedReactComponent])
.factory('factory', () => i += 1)
.component('app', {
    template: `
        <div>angular app</div>
        <wrapped-react-component message="'Hello, React!'"></wrapped-react-component>
    `,
    controller: ['factory', class {
        constructor(factory) {
            console.log(factory);
        }
    }]
})
.component('wrappedAngularComponent', {
    bindings: {
        message: '<'
    },
    template: `
        {{$ctrl.message}}
    `,
    controller: ['factory', class {
        constructor(factory) {
            console.log(factory);
        }
    }]
});

angular.bootstrap(root, ['app']);
