import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Form from './Form';
import {
  FormSchemeAllPropsPartial,
  FormSchemeInputPartial,
  FormSchemeInputFull,
} from './types';
import {
  generateFormSchemeInputDefaultConfigs,
  generateFormSchemePropsDefaultConfigs,
} from './utils/configs';

import convertToArray from './utils/convertToArray';
export { convertToArray };

function FormScheme(props: FormSchemeAllPropsPartial<Record<string, any>>) {
  const populateInitialValue = () => {
    const { inputs } = props.FORMSCHEME_PROPS;
    const initialValues: Record<string, any> = {};
    const initialErrors: Record<string, any> = {};
    const initialTouched: Record<string, any> = {};
    const initialValidationSchemaShape: any = {};

    const types = ['values', 'errors', 'touched'];
    function inner(
      input: FormSchemeInputPartial,
      attacher: Record<string, any>,
      full_path: string = '',
      parent: undefined | FormSchemeInputFull,
      schemaShape: any,
      index: number
    ) {
      const GeneratedFormSchemeInputConfigs = generateFormSchemeInputDefaultConfigs(
        input,
        full_path,
        parent,
        index
      );
      const {
        type,
        children,
        name,
        touched,
        defaultValue,
        required,
        label,
        error,
      } = GeneratedFormSchemeInputConfigs;
      const key = parent?.useArray ?? false ? index : name;
      if (type === 'group') {
        types.forEach(type => (attacher[type][key] = {}));
        schemaShape[key] = {};
        full_path += (full_path ? '.' : '') + key;
        children.forEach((child, _index) =>
          inner(
            child,
            types.reduce(
              (acc, type) => ({
                ...acc,
                [type]: attacher[type][key],
              }),
              {} as any
            ),
            full_path,
            GeneratedFormSchemeInputConfigs,
            schemaShape[key],
            _index
          )
        );
        schemaShape[key] = Yup.object()
          .shape(schemaShape[key])
          .required()
          .noUnknown()
          .strict(true);
      } else {
        let default_value = null;
        const is_number = type.match(/^(slider|number)$/);
        const is_text = type.match(/^(radio|textarea|text|select)$/);
        const is_bool = type.match(/^(checkbox|switch)$/);
        const is_arr = type.match(/^(multiselect)$/);
        const items =
          type.match(/(radio|select)/) &&
          input.items &&
          input.items.map(item => item.value);
        if (is_number) {
          schemaShape[key] = Yup.number().strict(true);
          default_value = 0;
        } else if (is_text) {
          schemaShape[key] = Yup.string().strict(true);
          default_value = '';
        } else if (is_bool) {
          schemaShape[key] = Yup.bool().strict(true);
          default_value = false;
        } else if (is_arr) {
          schemaShape[key] = Yup.array()
            .of(Yup.string().strict(true))
            .strict(true);
          default_value = [];
        }
        if (items && input.items) {
          schemaShape[key] = schemaShape[key].test({
            name: 'Oneof checker',
            message: `\${path} must be one of ${input.items
              .map(item => item.label)
              .join(',')} `,
            test: function(values: any) {
              return (!required && values === undefined) ||
                Array.isArray(values)
                ? values.every((val: string) => items.includes(val))
                : items.includes(values);
            },
          });
        }

        if (required)
          schemaShape[key] = schemaShape[key].required(
            `${label} is a required field`
          );

        attacher.values[key] = defaultValue || default_value;
        attacher.touched[key] = touched;
        attacher.errors[key] = error;
        full_path += name;

        try {
          schemaShape[key].validateSync(attacher.values[key]);
        } catch (err) {
          attacher.errors[key] = err.errors[0].replace('this', label);
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
        initialValidationSchemaShape,
        index
      )
    );
    return {
      initialValues,
      initialErrors,
      initialTouched,
      validationSchema: Yup.object()
        .shape(initialValidationSchemaShape)
        .required()
        .noUnknown()
        .strict(true),
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
