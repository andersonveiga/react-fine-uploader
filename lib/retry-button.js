'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RetryButton = function (_Component) {
    _inherits(RetryButton, _Component);

    function RetryButton(props) {
        _classCallCheck(this, RetryButton);

        var _this = _possibleConstructorReturn(this, (RetryButton.__proto__ || Object.getPrototypeOf(RetryButton)).call(this, props));

        _this.state = { retryable: false };

        _this._onComplete = function (id, name, response) {
            if (id === _this.props.id && !_this._unmounted) {
                var retryForbidden = isRetryForbidden(response, _this.props.uploader);

                if (!response.success && !retryForbidden && !_this.state.retryable) {
                    _this.setState({ retryable: true });
                } else if (response.success && _this.state.retryable) {
                    _this.setState({ retryable: false });
                } else if (retryForbidden && _this.state.retryable) {
                    _this.setState({ retryable: false });
                    _this._unregisterEventHandlers();
                }
            }
        };

        _this._onStatusChange = function (id, oldStatus, newStatus) {
            if (id === _this.props.id && !_this._unmounted && newStatus === props.uploader.qq.status.UPLOAD_RETRYING) {
                _this.setState({ retryable: false });
            }
        };

        _this._onClick = function () {
            return _this.props.uploader.methods.retry(_this.props.id);
        };
        return _this;
    }

    _createClass(RetryButton, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.uploader.on('complete', this._onComplete);
            this.props.uploader.on('statusChange', this._onStatusChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._unmounted = true;
            this._unregisterEventHandlers();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                onlyRenderIfRetryable = _props.onlyRenderIfRetryable,
                id = _props.id,
                uploader = _props.uploader,
                elementProps = _objectWithoutProperties(_props, ['children', 'onlyRenderIfRetryable', 'id', 'uploader']); // eslint-disable-line no-unused-vars


            var content = children || 'Retry';

            if (this.state.retryable || !onlyRenderIfRetryable) {
                return _react2.default.createElement(
                    'button',
                    _extends({ 'aria-label': 'retry',
                        className: 'react-fine-uploader-retry-button ' + (this.props.className || ''),
                        disabled: !this.state.retryable,
                        onClick: this.state.retryable && this._onClick,
                        type: 'button'
                    }, elementProps),
                    content
                );
            }

            return null;
        }
    }, {
        key: '_unregisterEventHandlers',
        value: function _unregisterEventHandlers() {
            this.props.uploader.off('complete', this._onComplete);
            this.props.uploader.off('statusChange', this._onStatusChange);
        }
    }]);

    return RetryButton;
}(_react.Component);

RetryButton.propTypes = {
    children: _propTypes2.default.node,
    id: _propTypes2.default.number.isRequired,
    onlyRenderIfRetryable: _propTypes2.default.bool,
    uploader: _propTypes2.default.object.isRequired
};
RetryButton.defaultProps = {
    onlyRenderIfRetryable: true
};


var isRetryForbidden = function isRetryForbidden(response, uploader) {
    var preventRetryResponseProperty = uploader.options.retry && uploader.options.retry.preventRetryResponseProperty || 'preventRetry';

    return !!response[preventRetryResponseProperty];
};

exports.default = RetryButton;