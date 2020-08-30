import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { ObjectSchema } from 'yup';

import generateYupSchema from './Yupschema';
import Form from './Form';
import {
  FormSchemePropsPartial,
  FormSchemeInputPartial,
  // FormSchemeInputFull,
} from './types';
import {
  generateFormSchemeInputDefaultConfigs,
  generateFormSchemePropsDefaultConfigs,
} from './utils/configs';

function FormScheme(props: FormSchemePropsPartial<Record<string, any>>) {
  const populateInitialValue = (
    validationSchema: ObjectSchema<Record<string, any> | undefined>
  ) => {
    const { inputs } = props;
    const initialValues: Record<string, any> = {};
    const initialErrors: Record<string, any> = {};

    function inner(
      input: FormSchemeInputPartial,
      parents: Record<string, any>,
      index: number
    ) {
      const GeneratedFormSchemeInputConfigs = generateFormSchemeInputDefaultConfigs(
        input,
        index
      );
      const {
        type,
        children,
        name,
        defaultValue,
        extra,
      } = GeneratedFormSchemeInputConfigs;

      if (type === 'group') {
        initialErrors[name] = {};
        if (extra.useObject) initialValues[name] = {};
        else if (extra.useArray) initialValues[name] = [];
        children.forEach((child, index) =>
          inner(
            child,
            extra.append
              ? { values: initialValues[name], errors: initialErrors[name] }
              : { values: initialValues, errors: initialErrors },
            index
          )
        );
      } else {
        parents.values[name] = defaultValue || '';
        try {
          validationSchema.validateSyncAt(defaultValue, parents.values[name], {
            abortEarly: true,
          });
        } catch (err) {
          parents.errors[name] = err.message;
        }
      }
    }
    inputs.forEach(input =>
      input
        ? inner(input, { values: initialValues, errors: initialErrors }, 0)
        : void 0
    );

    return { initialValues, initialErrors };
  };

  const validationSchema = generateYupSchema(props.inputs);
  const { initialValues, initialErrors } = populateInitialValue(
    validationSchema
  );

  const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);
  console.log(GeneratedFormSchemeProps);
  const {
    onSubmit,
    validateOnMount,
    children,
    passFormAsProp,
    initialTouched,
  } = GeneratedFormSchemeProps;

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
      {formik_props => {
        const FORM = <Form {...formik_props} {...GeneratedFormSchemeProps} />;
        return (
          <Fragment>
            {passFormAsProp ? null : FORM}
            {typeof children === 'function'
              ? children({
                  ...props,
                  FORM: passFormAsProp ? FORM : null,
                })
              : children}
          </Fragment>
        );
      }}
    </Formik>
  );
}

export default FormScheme;
