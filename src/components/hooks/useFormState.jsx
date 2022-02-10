import React from 'react';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';
import validator from 'validator';
import { ethers } from 'ethers';

export const fieldType = {
    ADDRESS: 'address',
    EMAIL: 'email',
    INT: 'int',
    INTEGER: 'integer',
    PASSWORD: 'password',
    STRING: 'string',
    URL: 'url',
    VERIFIED_PASSWORD: 'verified-password',
}

/** Returns an object with getters and setters for each state as needed following a {value: "", error: ""} key paradigm for each passed key string
 * @param {Array} initialStateKeysArray - List of objects to create get/setters for
 * @typedef {Object} FormStateReturn
 * @property {Object} formState - Object containing the form values
 * @property {Object} setters - Object containing the respective set functions named as set[key.name]()
 * @property {Function} onSubmit - Function to call when successful form submission has occurred if desired
 * @returns {FormStateReturn} - Returns an object composed of the values of the respective passed keys including: set<KEY>, set<KEY>Error and clear<KEY>Error as state functions
 */
export function useFormState(initialStateKeysArray) {
    // Initial State
    let initialState = {};

    let warnTypesNotSupplied = false;
    // Extrapolate keys from initial state array and populate with value && error sub-keys
    initialStateKeysArray.forEach(key => {
        if (!key.type) { warnTypesNotSupplied = true }
        initialState[key.name] = {
            name: key.name,
            display: key.display || false,
            error: "",
            validated: key.value
                ? _validateValueByType(key.value, key.type)
                : false,
            value: !!key.value ? key.value : "",
            type: key.type,
            isRequired: key.required || key.isRequired,
            required: key.required || key.isRequired,
        };
    })

    // Note types not supplied in console as warning
    if (warnTypesNotSupplied) {
        console.warn("useFormHook() using non-elevated-state validation. Verify key [type] is on the initialization objects to enable it.")
    }

    // Setup state blob
    const [formState, setFormState] = React.useState(
        Object.assign({}, initialState, {
            allValidated: _validateAllInSuppliedState(initialState)
        })
    );

    // Build setters for each key and return as set[KEY]Value && set[KEY]error
    let setters = {};
    initialStateKeysArray.forEach(key => {
        // Capitalize first name of function key
        const keyName = upperFirst(key.name);

        // Value Setter
        setters["set" + keyName] = (value) =>
            setFormState((prevState) => {
                let validated = _validateValueByType(value, prevState[key.name].type);
                let validationErr = _getValidationError(prevState[key.name].type, validated);
                let reqErr = _getRequirementError(
                    keyName,
                    prevState[key.name].required
                );

                return {
                    ...prevState,
                    [key.name]: {
                        ...prevState[key.name],
                        value: value,
                        preFlightError: reqErr ? reqErr : validationErr ? validationErr : ""
                    },
                    // Pass what will be newly built state to gather validation. . .
                    allValidated: _validateAllInSuppliedState({
                        ...prevState,
                        [key.name]: {
                            ...prevState[key.name],
                            value: value,
                            validated: _validateValueByType(value, prevState[key.name].type)
                        }
                    })
                };
            });

        // Provide external error setters for any complex situations
        setters["set" + keyName + "Error"] = (value) => setFormState(prevState => ({ ...prevState, [key.name]: { ...prevState[key.name], error: value } }));
        setters["clear" + keyName + "Error"] = () => setFormState(prevState => ({ ...prevState, [key.name]: { ...prevState[key.name], error: '' } }));
    });

    const onSubmit = async (callback) => {
        let errorsFound = false;

        for (let i = 0; i < initialStateKeysArray.length; i++) {

            let key = initialStateKeysArray[i];

            let error = "";
            if (key.validation) {
                if (!(await key.validation.check(formState[key.name].value))) {
                    error = key.validation.message;
                }
            }
            else {
                if (formState[key.name].isRequired && isEmpty(formState[key.name].value)) {
                    error = (formState[key.name].display || formState[key.name].name) + " is required";
                }
                else {
                    switch (formState[key.name].type) {
                        case fieldType.STRING:
                            if (!_validateValueByType(formState[key.name].value, fieldType.STRING)) {
                                error = (formState[key.name].display || formState[key.name].name) + " is not a valid string.";
                            }
                            break;
                        case fieldType.URL:
                            if (!_validateValueByType(formState[key.name].value, fieldType.URL)) {
                                error = (formState[key.name].display || formState[key.name].name) + " is not a valid HTTP URL";
                            }
                            break;
                        case fieldType.INTEGER:
                        case fieldType.INT:
                            if (!_validateValueByType(formState[key.name].value, fieldType.INTEGER)) {
                                error = (formState[key.name].display || formState[key.name].name) + " is not a valid number";
                            }
                            break;
                        case fieldType.ADDRESS:
                            if (!_validateValueByType(formState[key.name].value, fieldType.ADDRESS)) {
                                error = (formState[key.name].display || formState[key.name].name) + " is not a valid address";
                            }
                            break;
                        case fieldType.PASSWORD:
                            if (!_validateValueByType(formState[key.name].value, fieldType.PASSWORD)) {
                                error = (upperFirst(formState[key.name].display || formState[key.name].name)) + " must be atleast 8 characters long.";
                            }
                            break;
                        case fieldType.VERIFIED_PASSWORD:
                            if (formState[key.name].value !== formState['password'].value) {
                                error = "Passwords do not match.";
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

            const keyName = upperFirst(key.name);
            if (error) {
                setters['set' + keyName + 'Error'](error);
                errorsFound = true;
            }
            else {
                setters['clear' + keyName + 'Error']();
            }

        }

        if (!errorsFound) {
            callback();
        }
    };

    // Return it all
    return [formState, setters, onSubmit];
}

////////////////////////////////////
// Internal Hook Helper Functions //
////////////////////////////////////

// Internal validator function
function _validateValueByType(value, type) {
    if (!type) {
        return false
    }
    switch (type) {
        case fieldType.ADDRESS:
            return ethers.utils.isAddress(value);
        case fieldType.STRING:
            return typeof value === "string" && value !== "";
        case fieldType.INT:
        case fieldType.INTEGER:
            return validator.isInt(String(value));
        case fieldType.EMAIL:
            return validator.isEmail(String(value));
        case fieldType.URL:
            return validator.isURL(value, { protocols: ['http', 'https'] });
        case fieldType.PASSWORD:
            return value.length >= 8;
        default:
            new Error("Invalid type submitted to useFormState validator");
    }
}

// fullFormValidatorFunction -- Allow state param to call in useState() with initial params
function _validateAllInSuppliedState(currentFormState) {
    let passing = true;
    Object.keys(currentFormState).forEach((key) => {
        // For every key validate, if any fail, fail all else pass
        if (key === "allValidated") {
        } // Do nothing for this key
        else {
            let pass = _validateValueByType(
                currentFormState[key].value,
                currentFormState[key].type
            );
            if (!pass) {
                passing = false;
            }
        }
    });
    return passing;
}

// Internal validation error builder
function _getValidationError(type, isValidated) {
    if (!type) { return "" }
    if (isValidated) {
        return "";
    }
    switch (type) {
        case fieldType.STRING:
            return "Must be a string."
        case fieldType.ADDRESS:
            return "Must be a valid address"
        case fieldType.INT:
        case fieldType.INTEGER:
            return "Must be an integer"
        case fieldType.EMAIL:
            return "Must be an email"
        case fieldType.URL:
            return "Must be a URL";
        case fieldType.PASSWORD:
            return "Password must be at least 8 characters long.";
        default:
            new Error("Invalid type submitted to useFormState validator");
    }
}

function _getRequirementError(name, isRequired) {
    return isRequired ? "Field " + name + " is required." : "";
}