import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { ObjectSchema } from 'yup';

import generateYupSchema from './Yupschema';
import Form from './Form';
import {
  FormSchemePropsPartial,
  FormSchemeInputPartial,
  FormSchemeInputFull,
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
      parents: FormSchemeInputFull[] = [],
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
      } = GeneratedFormSchemeInputConfigs;
      if (type === 'group')
        children.forEach((child, index) =>
          inner(child, [...parents, GeneratedFormSchemeInputConfigs], index)
        );
      else {
        const parent = parents[parents.length - 1];
        const field_key =
          `${parent?.extra?.useObject || ''}` +
          (parent?.extra?.useArray ? index : name);
        initialValues[field_key] = defaultValue || '';
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
