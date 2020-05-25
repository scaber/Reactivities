'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));
var React = require('react');
var React__default = _interopDefault(React);
var finalForm = require('final-form');

// shared logic between components that use either render prop,
// children render function, or component prop
function renderComponent(props, name) {
  var render = props.render,
      children = props.children,
      component = props.component,
      rest = _objectWithoutPropertiesLoose(props, ["render", "children", "component"]);

  if (component) {
    return React.createElement(component, _extends({}, rest, {
      children: children,
      render: render
    }));
  }

  if (render) {
    return render(children === undefined ? rest : _extends({}, rest, {
      children: children
    })); // inject children back in
  }

  if (typeof children !== 'function') {
    throw new Error("Must specify either a render prop, a render function as children, or a component prop to " + name);
  }

  return children(rest);
}

function useWhenValueChanges(value, callback, isEqual) {
  if (isEqual === void 0) {
    isEqual = function isEqual(a, b) {
      return a === b;
    };
  }

  var previous = React__default.useRef(value);
  React__default.useEffect(function () {
    if (!isEqual(value, previous.current)) {
      callback();
      previous.current = value;
    }
  });
}

/**
 * A simple hook to create a constant value that lives for
 * the lifetime of the component.
 *
 * Plagiarized from https://github.com/Andarist/use-constant
 *
 * Do NOT reuse this code unless you know what you're doing.
 * Use Andarist's hook; it's more fault tolerant to things like
 * falsy values.
 *
 * @param {Function} init - A function to generate the value
 */

function useConstant(init) {
  var ref = React__default.useRef();

  if (!ref.current) {
    ref.current = init();
  }

  return ref.current;
}

var shallowEqual = function shallowEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false;
  }

  var keysA = Object.keys(a);
  var keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b);

  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
};

var isSyntheticEvent = function isSyntheticEvent(candidate) {
  return !!(candidate && typeof candidate.stopPropagation === 'function');
};

var ReactFinalFormContext = React.createContext();

function useLatest(value) {
  var ref = React__default.useRef(value);
  React__default.useEffect(function () {
    ref.current = value;
  });
  return ref;
}

var version = "6.3.0";

var versions = {
  'final-form': finalForm.version,
  'react-final-form': version
};
var all = finalForm.formSubscriptionItems.reduce(function (result, key) {
  result[key] = true;
  return result;
}, {});

function ReactFinalForm(_ref) {
  var debug = _ref.debug,
      decorators = _ref.decorators,
      destroyOnUnregister = _ref.destroyOnUnregister,
      alternateFormApi = _ref.form,
      initialValues = _ref.initialValues,
      initialValuesEqual = _ref.initialValuesEqual,
      keepDirtyOnReinitialize = _ref.keepDirtyOnReinitialize,
      mutators = _ref.mutators,
      onSubmit = _ref.onSubmit,
      _ref$subscription = _ref.subscription,
      subscription = _ref$subscription === void 0 ? all : _ref$subscription,
      validate = _ref.validate,
      validateOnBlur = _ref.validateOnBlur,
      rest = _objectWithoutPropertiesLoose(_ref, ["debug", "decorators", "destroyOnUnregister", "form", "initialValues", "initialValuesEqual", "keepDirtyOnReinitialize", "mutators", "onSubmit", "subscription", "validate", "validateOnBlur"]);

  var config = {
    debug: debug,
    destroyOnUnregister: destroyOnUnregister,
    initialValues: initialValues,
    keepDirtyOnReinitialize: keepDirtyOnReinitialize,
    mutators: mutators,
    onSubmit: onSubmit,
    validate: validate,
    validateOnBlur: validateOnBlur
  };
  var form = useConstant(function () {
    var f = alternateFormApi || finalForm.createForm(config);
    f.pauseValidation();
    return f;
  }); // synchronously register and unregister to query form state for our subscription on first render

  var _React$useState = React.useState(function () {
    var initialState = {};
    form.subscribe(function (state) {
      initialState = state;
    }, subscription)();
    return initialState;
  }),
      state = _React$useState[0],
      setState = _React$useState[1]; // save a copy of state that can break through the closure
  // on the shallowEqual() line below.


  var stateRef = useLatest(state);
  React.useEffect(function () {
    // We have rendered, so all fields are no registered, so we can unpause validation
    form.isValidationPaused() && form.resumeValidation();
    var unsubscriptions = [form.subscribe(function (s) {
      if (!shallowEqual(s, stateRef.current)) {
        setState(s);
      }
    }, subscription)].concat(decorators ? decorators.map(function (decorator) {
      return (// this noop ternary is to appease the flow gods
        // istanbul ignore next
        decorator(form)
      );
    }) : []);
    return function () {
      unsubscriptions.forEach(function (unsubscribe) {
        return unsubscribe();
      });
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decorators]); // warn about decorator changes
  // istanbul ignore next

  if (process.env.NODE_ENV !== 'production') {
    // You're never supposed to use hooks inside a conditional, but in this
    // case we can be certain that you're not going to be changing your
    // NODE_ENV between renders, so this is safe.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWhenValueChanges(decorators, function () {
      console.error('Form decorators should not change from one render to the next as new values will be ignored');
    }, shallowEqual);
  } // allow updatable config


  useWhenValueChanges(debug, function () {
    form.setConfig('debug', debug);
  });
  useWhenValueChanges(destroyOnUnregister, function () {
    form.destroyOnUnregister = !!destroyOnUnregister;
  });
  useWhenValueChanges(initialValues, function () {
    form.setConfig('initialValues', initialValues);
  }, initialValuesEqual || shallowEqual);
  useWhenValueChanges(keepDirtyOnReinitialize, function () {
    form.setConfig('keepDirtyOnReinitialize', keepDirtyOnReinitialize);
  });
  useWhenValueChanges(mutators, function () {
    form.setConfig('mutators', mutators);
  });
  useWhenValueChanges(onSubmit, function () {
    form.setConfig('onSubmit', onSubmit);
  });
  useWhenValueChanges(validate, function () {
    form.setConfig('validate', validate);
  });
  useWhenValueChanges(validateOnBlur, function () {
    form.setConfig('validateOnBlur', validateOnBlur);
  });

  var handleSubmit = function handleSubmit(event) {
    if (event) {
      // sometimes not true, e.g. React Native
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }

      if (typeof event.stopPropagation === 'function') {
        // prevent any outer forms from receiving the event too
        event.stopPropagation();
      }
    }

    return form.submit();
  };

  var renderProps = _extends({}, state, {
    form: _extends({}, form, {
      reset: function reset(eventOrValues) {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          form.reset();
        } else {
          form.reset(eventOrValues);
        }
      }
    }),
    handleSubmit: handleSubmit
  });

  return React.createElement(ReactFinalFormContext.Provider, {
    value: form
  }, renderComponent(_extends({}, rest, renderProps, {
    __versions: versions
  }), 'ReactFinalForm'));
}

function useForm(componentName) {
  var form = React.useContext(ReactFinalFormContext);

  if (!form) {
    throw new Error((componentName || 'useForm') + " must be used inside of a <Form> component");
  }

  return form;
}

function useFormState(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onChange = _ref.onChange,
      _ref$subscription = _ref.subscription,
      subscription = _ref$subscription === void 0 ? all : _ref$subscription;

  var form = useForm('useFormState');
  var firstRender = React.useRef(true); // synchronously register and unregister to query field state for our subscription on first render

  var _React$useState = React.useState(function () {
    var initialState = {};
    form.subscribe(function (state) {
      initialState = state;
    }, subscription)();

    if (onChange) {
      onChange(initialState);
    }

    return initialState;
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  React.useEffect(function () {
    return form.subscribe(function (newState) {
      if (firstRender.current) {
        firstRender.current = false;
      } else {
        setState(newState);

        if (onChange) {
          onChange(newState);
        }
      }
    }, subscription);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  return state;
}

function FormSpy(_ref) {
  var onChange = _ref.onChange,
      subscription = _ref.subscription,
      rest = _objectWithoutPropertiesLoose(_ref, ["onChange", "subscription"]);

  var reactFinalForm = useForm('FormSpy');
  var state = useFormState({
    onChange: onChange,
    subscription: subscription
  });

  if (onChange) {
    return null;
  }

  var renderProps = {
    form: _extends({}, reactFinalForm, {
      reset: function reset(eventOrValues) {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          reactFinalForm.reset();
        } else {
          reactFinalForm.reset(eventOrValues);
        }
      }
    })
  };
  return renderComponent(_extends({}, rest, state, renderProps), 'FormSpy');
}

var isReactNative = typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';

var getSelectedValues = function getSelectedValues(options) {
  var result = [];

  if (options) {
    for (var index = 0; index < options.length; index++) {
      var option = options[index];

      if (option.selected) {
        result.push(option.value);
      }
    }
  }

  return result;
};

var getValue = function getValue(event, currentValue, valueProp, isReactNative) {
  if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
    return event.nativeEvent.text;
  }

  if (isReactNative && event.nativeEvent) {
    return event.nativeEvent.text;
  }

  var detypedEvent = event;
  var _detypedEvent$target = detypedEvent.target,
      type = _detypedEvent$target.type,
      value = _detypedEvent$target.value,
      checked = _detypedEvent$target.checked;

  switch (type) {
    case 'checkbox':
      if (valueProp !== undefined) {
        // we are maintaining an array, not just a boolean
        if (checked) {
          // add value to current array value
          return Array.isArray(currentValue) ? currentValue.concat(valueProp) : [valueProp];
        } else {
          // remove value from current array value
          if (!Array.isArray(currentValue)) {
            return currentValue;
          }

          var index = currentValue.indexOf(valueProp);

          if (index < 0) {
            return currentValue;
          } else {
            return currentValue.slice(0, index).concat(currentValue.slice(index + 1));
          }
        }
      } else {
        // it's just a boolean
        return !!checked;
      }

    case 'select-multiple':
      return getSelectedValues(event.target.options);

    default:
      return value;
  }
};

var all$1 = finalForm.fieldSubscriptionItems.reduce(function (result, key) {
  result[key] = true;
  return result;
}, {});

var defaultFormat = function defaultFormat(value, name) {
  return value === undefined ? '' : value;
};

var defaultParse = function defaultParse(value, name) {
  return value === '' ? undefined : value;
};

function useField(name, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      afterSubmit = _ref.afterSubmit,
      allowNull = _ref.allowNull,
      beforeSubmit = _ref.beforeSubmit,
      component = _ref.component,
      defaultValue = _ref.defaultValue,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? defaultFormat : _ref$format,
      formatOnBlur = _ref.formatOnBlur,
      initialValue = _ref.initialValue,
      isEqual = _ref.isEqual,
      multiple = _ref.multiple,
      _ref$parse = _ref.parse,
      parse = _ref$parse === void 0 ? defaultParse : _ref$parse,
      _ref$subscription = _ref.subscription,
      subscription = _ref$subscription === void 0 ? all$1 : _ref$subscription,
      type = _ref.type,
      validate = _ref.validate,
      validateFields = _ref.validateFields,
      _value = _ref.value;

  var form = useForm('useField');
  var validateRef = useLatest(validate);
  var beforeSubmitRef = useLatest(function () {
    if (formatOnBlur) {
      var formatted = format(state.value, state.name);

      if (formatted !== state.value) {
        state.change(formatted);
      }
    }

    return beforeSubmit && beforeSubmit();
  });

  var register = function register(callback) {
    return form.registerField(name, callback, subscription, {
      afterSubmit: afterSubmit,
      beforeSubmit: function beforeSubmit() {
        return beforeSubmitRef.current();
      },
      defaultValue: defaultValue,
      getValidator: function getValidator() {
        return validateRef.current;
      },
      initialValue: initialValue,
      isEqual: isEqual,
      validateFields: validateFields
    });
  };

  var firstRender = React.useRef(true); // synchronously register and unregister to query field state for our subscription on first render

  var _React$useState = React.useState(function () {
    var initialState = {}; // temporarily disable destroyOnUnregister

    var destroyOnUnregister = form.destroyOnUnregister;
    form.destroyOnUnregister = false;
    register(function (state) {
      initialState = state;
    })(); // return destroyOnUnregister to its original value

    form.destroyOnUnregister = destroyOnUnregister;
    return initialState;
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  React.useEffect(function () {
    return register(function (state) {
      if (firstRender.current) {
        firstRender.current = false;
      } else {
        setState(state);
      }
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [name, defaultValue, // If we want to allow inline fat-arrow field-level validation functions, we
  // cannot reregister field every time validate function !==.
  // validate,
  initialValue, isEqual // The validateFields array is often passed as validateFields={[]}, creating
  // a !== new array every time. If it needs to be changed, a rerender/reregister
  // can be forced by changing the key prop
  // validateFields
  ]);
  var handlers = {
    onBlur: React.useCallback(function (event) {
      state.blur();

      if (formatOnBlur) {
        /**
         * Here we must fetch the value directly from Final Form because we cannot
         * trust that our `state` closure has the most recent value. This is a problem
         * if-and-only-if the library consumer has called `onChange()` immediately
         * before calling `onBlur()`, but before the field has had a chance to receive
         * the value update from Final Form.
         */
        var fieldState = form.getFieldState(state.name); // this ternary is primarily to appease the Flow gods
        // istanbul ignore next

        state.change(format(fieldState ? fieldState.value : state.value, state.name));
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.name, state.value, format, formatOnBlur]),
    onChange: React.useCallback(function (event) {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production' && event && event.target) {
        var targetType = event.target.type;
        var unknown = ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) && !type;

        var _value2 = targetType === 'select-multiple' ? state.value : _value;

        if (unknown) {
          console.error("You must pass `type=\"" + (targetType === 'select-multiple' ? 'select' : targetType) + "\"` prop to your Field(" + name + ") component.\n" + ("Without it we don't know how to unpack your `value` prop - " + (Array.isArray(_value2) ? "[" + _value2 + "]" : "\"" + _value2 + "\"") + "."));
        }
      }

      var value = event && event.target ? getValue(event, state.value, _value, isReactNative) : event;
      state.change(parse(value, name));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [_value, name, parse, state.change, state.value, type]),
    onFocus: React.useCallback(function (event) {
      state.focus(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  };

  var blur = state.blur,
      change = state.change,
      focus = state.focus,
      value = state.value,
      ignoreName = state.name,
      otherState = _objectWithoutPropertiesLoose(state, ["blur", "change", "focus", "value", "name"]);

  var meta = {
    // this is to appease the Flow gods
    active: otherState.active,
    data: otherState.data,
    dirty: otherState.dirty,
    dirtySinceLastSubmit: otherState.dirtySinceLastSubmit,
    error: otherState.error,
    initial: otherState.initial,
    invalid: otherState.invalid,
    length: otherState.length,
    modified: otherState.modified,
    pristine: otherState.pristine,
    submitError: otherState.submitError,
    submitFailed: otherState.submitFailed,
    submitSucceeded: otherState.submitSucceeded,
    submitting: otherState.submitting,
    touched: otherState.touched,
    valid: otherState.valid,
    validating: otherState.validating,
    visited: otherState.visited
  };

  if (formatOnBlur) {
    if (component === 'input') {
      value = defaultFormat(value);
    }
  } else {
    value = format(value, name);
  }

  if (value === null && !allowNull) {
    value = '';
  }

  var input = _extends({
    name: name,
    value: value,
    type: type
  }, handlers);

  if (type === 'checkbox') {
    if (_value === undefined) {
      input.checked = !!value;
    } else {
      input.checked = !!(Array.isArray(value) && ~value.indexOf(_value));
      input.value = _value;
    }
  } else if (type === 'radio') {
    input.checked = value === _value;
    input.value = _value;
  } else if (component === 'select' && multiple) {
    input.value = input.value || [];
    input.multiple = true;
  }

  var renderProps = {
    input: input,
    meta: meta // assign to force Flow check

  };
  return renderProps;
}

var Field = function Field(_ref) {
  var afterSubmit = _ref.afterSubmit,
      allowNull = _ref.allowNull,
      beforeSubmit = _ref.beforeSubmit,
      children = _ref.children,
      component = _ref.component,
      defaultValue = _ref.defaultValue,
      format = _ref.format,
      formatOnBlur = _ref.formatOnBlur,
      initialValue = _ref.initialValue,
      isEqual = _ref.isEqual,
      multiple = _ref.multiple,
      name = _ref.name,
      parse = _ref.parse,
      subscription = _ref.subscription,
      type = _ref.type,
      validate = _ref.validate,
      validateFields = _ref.validateFields,
      value = _ref.value,
      rest = _objectWithoutPropertiesLoose(_ref, ["afterSubmit", "allowNull", "beforeSubmit", "children", "component", "defaultValue", "format", "formatOnBlur", "initialValue", "isEqual", "multiple", "name", "parse", "subscription", "type", "validate", "validateFields", "value"]);

  var field = useField(name, {
    afterSubmit: afterSubmit,
    allowNull: allowNull,
    beforeSubmit: beforeSubmit,
    children: children,
    component: component,
    defaultValue: defaultValue,
    format: format,
    formatOnBlur: formatOnBlur,
    initialValue: initialValue,
    isEqual: isEqual,
    multiple: multiple,
    parse: parse,
    subscription: subscription,
    type: type,
    validate: validate,
    validateFields: validateFields,
    value: value
  });

  if (typeof children === 'function') {
    return children(_extends({}, field, rest));
  }

  if (typeof component === 'string') {
    // ignore meta, combine input with any other props
    return React.createElement(component, _extends({}, field.input, {
      children: children
    }, rest));
  }

  return renderComponent(_extends({}, field, {
    children: children,
    component: component
  }, rest), "Field(" + name + ")");
};

function withTypes() {
  return {
    Form: ReactFinalForm,
    FormSpy: FormSpy
  };
}

exports.Field = Field;
exports.Form = ReactFinalForm;
exports.FormSpy = FormSpy;
exports.useField = useField;
exports.useForm = useForm;
exports.useFormState = useFormState;
exports.version = version;
exports.withTypes = withTypes;
