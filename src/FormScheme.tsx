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
    const types = ['values', 'errors', 'touched'];
    function inner(
      input: FormSchemeInputPartial,
      attacher: Record<string, any>,
      full_path: string = '',
      parent: undefined | FormSchemeInputFull,
      index: number
    ) {
      const GeneratedFormSchemeInputConfigs = generateFormSchemeInputDefaultConfigs(
        input,
        full_path,
        parent,
        index
      );
      const isArray = parent?.useArray ?? false;
      const {
        type,
        children,
        name,
        touched,
        defaultValue,
        useArray,
        useObject,
      } = GeneratedFormSchemeInputConfigs;
      // debugger;
      if (type === 'group') {
        if (useObject) {
          types.forEach(type => (attacher[type][isArray ? index : name] = {}));
          full_path += `${isArray ? `[${index}]` : name}.`;
        } else if (useArray) {
          types.forEach(type => (attacher[type][isArray ? index : name] = []));
          full_path += `${name}`;
        }
        children.forEach((child, _index) =>
          inner(
            child,
              types.reduce(
                  (acc, type) => ({
                    ...acc,
                    [type]: attacher[type][isArray ? index : name],
                  }),
                  {} as any
                ),
              
            full_path,
            GeneratedFormSchemeInputConfigs,
            _index
          )
        );
      } else {
        const is_number = type.match(/(slider|number)/);
        if (isArray) {
          attacher.values.push(defaultValue || (is_number ? 0 : ''));
          attacher.touched.push(touched);
          full_path += `[${index}]`;
        } else {
          attacher.values[name] = defaultValue || (is_number ? 0 : '');
          attacher.touched[name] = touched;
          full_path += `${name}`;
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
          isArray
            ? attacher.errors.push(err.message)
            : (attacher.errors[name] = err.message);
        }
      }
    }
    inputs.forEach((input, index) =>
      inner(
        input,
        {
          values: initialValues,
          errors: initialErrors,
          touched: initialTouched,
        },
        '',
        undefined,
        index
      )
    );

    return { initialValues, initialErrors, initialTouched };
  };

  const validationSchema = generateYupSchema(props.FORMSCHEME_PROPS.inputs);

  const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);

  const {
    FORMSCHEME_PROPS: { passFormAsProp },
    FORMIK_CONFIGS,
  } = GeneratedFormSchemeProps;
  const { initialValues, initialErrors, initialTouched } = populateInitialValue(
    validationSchema
  );

  FORMIK_CONFIGS.initialValues = initialValues;
  FORMIK_CONFIGS.initialErrors = initialErrors;
  FORMIK_CONFIGS.initialTouched = initialTouched;
  FORMIK_CONFIGS.validationSchema = validationSchema;
  const { children } = props;
  return (
    <Formik {...FORMIK_CONFIGS}>
      {formik_props => {
        const FORM = (
          <Form FORMIK_PROPS={formik_props} {...GeneratedFormSchemeProps} />
        );
        return (
          <Fragment>
            {passFormAsProp && FORM}
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
