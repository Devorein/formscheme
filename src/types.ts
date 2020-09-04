import { ReactElement, ReactNode } from 'react';
import { FormikConfig, FormikProps } from 'formik/dist/types';

/**
 * All the types of inputs available
 */
export type FormElementType =
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'group'
  | 'text'
  | 'number'
  | 'component'
  | 'slider'
  | 'textarea'
  | 'switch';

/**
 * All the types of placement available
 */
export type placement = 'center' | 'flex-start' | 'flex-end';

/**
 * Items interface for inputs that requires items
 */
export interface Items {
  value: string;
  label: string;
  icon: any;
}

export interface FormSchemeInputFull {
  name: string;
  disabled: boolean;
  required: boolean;
  className: string | undefined;
  children: FormSchemeInputsFull;
  placeholder: string;
  type: FormElementType;
  helperText: undefined | string;
  defaultValue: any;
  label: undefined | string;
  controlled: boolean;
  onKeyPress: () => any;
  fieldHandler: (value: any) => any;
  siblings: FormSchemeInputFull[];
  useObject: boolean;
  useArray: boolean;
  items: Items[];
  treeView: boolean;
  collapse: boolean;
  append: boolean;
  input_props: any;
  touched: boolean;
  error: string;
  key: string;
  component: undefined | JSX.Element;
  full_path: string;
  labelPlacement: placement;
  helperTextPlacement: placement;
  errorTextPlacement: placement;
  row: boolean;
}

export type FormSchemeInputPartial = { name: string } & Partial<FormSchemeInputFull>;

export type FormSchemeInputsPartial = FormSchemeInputPartial[];
export type FormSchemeInputsFull = FormSchemeInputFull[];

export interface FormSchemePropsFull {
  inputs: FormSchemeInputsFull;
  formButtons: boolean;
  classNames: undefined | string;
  errorBeforeTouched: boolean;
  submitMsg: string;
  resetMsg: string;
  submitButton: true;
  resetButton: true;
  disabled: boolean;
  submitTimeout: undefined | number;
  treeViewExpandIcon: JSX.Element;
  treeViewCollapseIcon: JSX.Element;
  centerButtons: boolean;
}

export interface FormSchemeAllPropsFull<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>;
  FORMSCHEME_PROPS: FormSchemePropsFull;
  children: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
}

export type FormSchemeAllPropsPartial<Values> = {
  FORMIK_CONFIGS?: FormikConfig<Values>;
  FORMSCHEME_PROPS: { inputs: FormSchemeInputsPartial } & Partial<FormSchemePropsFull>;
  children?: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
};

export interface FormPropsPartial<Values>
  extends FormSchemeAllPropsPartial<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}

export interface FormPropsFull<Values> extends FormSchemeAllPropsFull<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}
