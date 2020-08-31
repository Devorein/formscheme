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
    const { inputs } = props.FORMSCHEME_PROPS;
    const initialValues: Record<string, any> = {};
    const initialErrors: Record<string, any> = {};
    const initialTouched: Record<string, any> = {};

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
        touched,
        defaultValue,
        extra,
      } = GeneratedFormSchemeInputConfigs;

      if (type === 'group') {
        if (extra.useObject) {
          initialValues[name] = {};
          initialErrors[name] = {};
          initialTouched[name] = {};
        } else if (extra.useArray) {
          initialValues[name] = [];
          initialErrors[name] = [];
          initialTouched[name] = [];
        }
        children.forEach((child, index) =>
          inner(
            child,
            extra.append
              ? {
                  values: initialValues[name],
                  errors: initialErrors[name],
                  touched: initialTouched[name],
                }
              : {
                  values: initialValues,
                  errors: initialErrors,
                  touched: initialTouched,
                },
            [...parents, GeneratedFormSchemeInputConfigs],
            index
          )
        );
      } else {
        const isArray = Array.isArray(attacher.values);
        if (isArray) {
          attacher.values.push(defaultValue || '');
          attacher.touched.push(touched);
        } else {
          attacher.values[name] = defaultValue || '';
          attacher.touched[name] = touched;
        }
        try {
          validationSchema.validateSyncAt(
            defaultValue,
            isArray ? attacher.values[index] : attacher.values[name],
            {
              abortEarly: true,
            }
          );
        } catch (err) {
          if (isArray) attacher.errors[name] = err.message;
          else attacher.errors.push(err.message);
        }
      }
    }
    inputs.forEach(input =>
      input
        ? inner(
            input,
            {
              values: initialValues,
              errors: initialErrors,
              touched: initialTouched,
            },
            [],
            0
          )
        : void 0
    );

    return { initialValues, initialErrors, initialTouched };
  };

  const validationSchema = generateYupSchema(props.FORMSCHEME_PROPS.inputs);

  const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);

  const {
    FORMSCHEME_PROPS: { passFormAsProp },
    children,
    FORMIK_CONFIGS,
  } = GeneratedFormSchemeProps;
  const { initialValues, initialErrors, initialTouched } = populateInitialValue(
    validationSchema
  );
  FORMIK_CONFIGS.initialValues = initialValues;
  FORMIK_CONFIGS.initialErrors = initialErrors;
  FORMIK_CONFIGS.initialTouched = initialTouched;
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
