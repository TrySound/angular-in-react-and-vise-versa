import React from 'react';
import contextTypes from './contextTypes.js';

const renderAngularInReact = (name, keys) => {
    class wrapped extends React.Component {
        constructor(props, context) {
            super(props);
            this.ref = this.ref.bind(this);
            this.tagName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            this.bindings = keys.reduce((acc, key) => {
                acc[key] = key;
                return acc;
            }, {});
            this.$scope = context.$rootScope.$new();
            this.renderAngular(this.props, true);
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
            if (element) {
                this.context.$compile(element)(this.$scope);
            }
        }

        renderAngular(props, sync) {
            if (sync) {
                keys.forEach(key => {
                    this.$scope[key] = props[key];
                });
            } else {
                this.$scope.$evalAsync(() => {
                    keys.forEach(key => {
                        this.$scope[key] = props[key];
                    });
                });
            }
        }

        render() {
            return (
                React.createElement(this.tagName, Object.assign({}, this.bindings, { ref: this.ref }))
            );
        }
    }
    wrapped.contextTypes = contextTypes;
    return wrapped;
};

export default renderAngularInReact;
