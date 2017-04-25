import React from 'react';
import contextTypes from './contextTypes.js';

const renderAngularInReact = (name, keys) => {
    class wrapped extends React.Component {
        constructor(props) {
            super(props);
            this.ref = this.ref.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            if (this.$scope) {
                this.renderAngular(nextProps);
            }
        }

        componentWillUnmount() {
            this.$scope.$destroy();
        }

        ref(element) {
            const tagName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            const $scope = this.context.$rootScope.$new();
            this.$scope = $scope;
            this.renderAngular(this.props);
            element.innerHTML = `
                <${tagName} ${keys.map(key => `${key}="${key}"`).join(' ')}></${tagName}>
            `;
            this.context.$compile(element.childNodes)($scope);
        }

        renderAngular(props) {
            this.$scope.$evalAsync(() => {
                keys.forEach(key => {
                    this.$scope[key] = props[key];
                });
            });
        }

        render() {
            return (
                React.createElement('div', { ref: this.ref })
            );
        }
    }
    wrapped.contextTypes = contextTypes;
    return wrapped;
};

export default renderAngularInReact;
