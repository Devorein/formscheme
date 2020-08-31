import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { ObjectSchema } from 'yup';

import generateYupSchema from './Yupschema';
import Form from './Form';
import {
  FormSchemePropsPartial,
  FormSchemeInputPartial,
  FormSchemeInputFull,
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
    const { inputs } = props.FORMSCHEME_PROPS;
    const initialValues: Record<string, any> = {};
    const initialErrors: Record<string, any> = {};

    function inner(
      input: FormSchemeInputPartial,
      attacher: Record<string, any>,
      parents: FormSchemeInputFull[] = [],
      index: number
    ) {
      const GeneratedFormSchemeInputConfigs = generateFormSchemeInputDefaultConfigs(
        input,
        parents,
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
            [...parents, GeneratedFormSchemeInputConfigs],
            index
          )
        );
      } else {
        if (Array.isArray(attacher.values))
          attacher.values.push(defaultValue || '');
        else attacher.values[name] = defaultValue || '';
        try {
          validationSchema.validateSyncAt(
            defaultValue,
            Array.isArray(attacher.values)
              ? attacher.values[index]
              : attacher.values[name],
            {
              abortEarly: true,
            }
          );
        } catch (err) {
          attacher.errors[name] = err.message;
        }
      }
    }
    inputs.forEach(input =>
      input
        ? inner(input, { values: initialValues, errors: initialErrors }, [], 0)
        : void 0
    );

    return { initialValues, initialErrors };
  };

  const validationSchema = generateYupSchema(props.FORMSCHEME_PROPS.inputs);

  const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);

  const {
    FORMSCHEME_PROPS: { passFormAsProp },
    children,
    FORMIK_CONFIGS,
  } = GeneratedFormSchemeProps;
  const { initialValues, initialErrors } = populateInitialValue(
    validationSchema
  );
  FORMIK_CONFIGS.initialValues = initialValues;
  FORMIK_CONFIGS.initialErrors = initialErrors;
  FORMIK_CONFIGS.validationSchema = validationSchema;

  return (
    <Formik {...FORMIK_CONFIGS}>
      {formik_props => {
        const FORM = (
          <Form FORMIK_PROPS={formik_props} {...GeneratedFormSchemeProps} />
        );
        return (
          <Fragment>
            {passFormAsProp ? null : FORM}
            {typeof children === 'function'
              ? children({
                  FORMIK_PROPS: formik_props,
                  ...GeneratedFormSchemeProps,
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
