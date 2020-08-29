import React, { Fragment } from 'react';
import { Formik } from 'formik';

// import Form from './Form';
import { InputFormProps, FormSchemeInputs, FormSchemeInput } from './types';

function InputForm(props: InputFormProps) {
  const populateInitialValue = (inputs: FormSchemeInputs) => {
    const { validationSchema } = props;
    const initialValues: Record<string, any> = {};
    const initialErrors: Record<string, any> = {};

    function inner(
      input: FormSchemeInput,
      parents: FormSchemeInput[] = [],
      index: number
    ) {
      /*       let target_obj = {};
      const full_path = parents.reduce(
        (acc, parent) => (parent.append ? initialValues[parent.name] : acc),
        []
      ); */
      const parent = parents[parents.length - 1] || {};
      const { extra } = parent;
      if (input.type === 'group') {
        if (input.children)
          input.children.forEach((child, index) =>
            inner(child, [...parents, input], index)
          );
        else throw new Error('Grouped FormScheme must have childrens');
      } else {
        const { name, defaultValue } = input;
        const field_key = `${extra.append}` + (extra.useArray ? index : name);
        input.name = field_key;
        initialValues[field_key] =
          typeof defaultValue !== 'undefined' ? defaultValue : '';
        try {
          validationSchema.validateSyncAt(field_key, initialValues[field_key], {
            abortEarly: true,
          });
        } catch (err) {
          initialErrors[field_key] = err.message;
        }
      }
    }
    inputs.forEach(input => (input ? inner(input, [], 0) : void 0));

    return { initialValues, initialErrors };
  };
  const {
    validationSchema,
    inputs,
    onSubmit,
    customHandler,
    formButtons,
    classNames,
    validateOnMount = false,
    errorBeforeTouched = false,
    submitMsg,
    children,
    passFormAsProp = false,
    initialTouched,
    disabled,
  } = props;

  const { initialValues, initialErrors } = populateInitialValue(inputs);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnMount={validateOnMount}
      enableReinitialize={true}
      initialTouched={initialTouched || {}}
      initialErrors={initialErrors}
    >
      {props => {
        const FORM = {
          /* 						<Form
							{...props}
							classNames={classNames}
							inputs={inputs}
							customHandler={customHandler}
							formButtons={formButtons}
							errorBeforeTouched={errorBeforeTouched}
							submitMsg={submitMsg}
							disabled={disabled}
						/> */
        };
        return (
          <Fragment>
            {passFormAsProp ? null : FORM}
            {typeof children === 'function'
              ? children({
                  ...props,
                  inputs: passFormAsProp ? FORM : null,
                })
              : children}
          </Fragment>
        );
      }}
    </Formik>
  );
}

export default InputForm;
