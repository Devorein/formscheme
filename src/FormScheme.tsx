import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
  const populateInitialValue = () => {
    const validationSchemaShape = {};
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
      } = GeneratedFormSchemeInputConfigs;
      if (type === 'group') {
        types.forEach(
          type => (attacher[type][isArray ? index : name] = useArray ? [] : {})
        );
        full_path += `${
          isArray ? `[${index}]` : `${full_path ? `.${name}` : name}`
        }`;
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
        attacher.values[isArray ? index : name] =
          defaultValue || (is_number ? 0 : '');
        attacher.touched[isArray ? index : name] = touched;
        full_path += name;
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

    return {
      initialValues,
      initialErrors,
      initialTouched,
      validationSchema: Yup.object(validationSchemaShape),
    };
  };

  const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);

  const { FORMIK_CONFIGS } = GeneratedFormSchemeProps;
  const {
    initialValues,
    initialErrors,
    initialTouched,
    validationSchema,
  } = populateInitialValue();

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
            {typeof children === 'function' ? (
              children({
                FORMIK_PROPS: formik_props,
                ...GeneratedFormSchemeProps,
                FORM,
              })
            ) : (
              <Fragment>
                {FORM}
                {children}
              </Fragment>
            )}
          </Fragment>
        );
      }}
    </Formik>
  );
}

export default FormScheme;
