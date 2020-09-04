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
  /**Name of the input (this is used to build the full path to the input for Formik) */
  name: string;
  /**Disable the input, also effects all of its children */
  disabled: boolean;
  /**Makes the input required, MUI adds * to required inputs */
  required: boolean;
  /**Custom classname to be attached to the input */
  className: string | undefined;
  /**Children of the input, only use if the type is group */
  children: FormSchemeInputsFull;
  /**Placeholder value used in the input */
  placeholder: string;
  /**Type of the input field */
  type: FormElementType;
  /**Used to give relevant information regarding the input */
  helperText: undefined | string;
  /**Default value of the input, used to build up the initialValues for Formik */
  defaultValue: any;
  /**Label of the input, if npt provided generated from the name */
  label: undefined | string;
  /**Whether the input is controlled by Formik or not */
  controlled: boolean;
  /**Used to control the form when not controlled */
  onKeyPress: () => any;
  /**Used to control the form when not controlled*/
  fieldHandler: (value: any) => any;
  /**If true uses an object with [name] keys in the initialValues */
  useObject: boolean;
  /**If true uses an object with [index] keys in the initialValues */
  useArray: boolean;
  /**Provide items if the input type supports it */
  items: Items[];
  /**If true uses MUI TreeView to group form inputs */
  treeView: boolean;
  /**Initial state of the treeView if present */
  collapse: boolean;
  /**Used to group inputs together without the effect of useObject or useArray */
  append: boolean;
  /**Extra input props passed to the input */
  input_props: any;
  /**Used to populate the initialTouched for Formik */
  touched: boolean;
  /**Used to populate the initialErrors for Formik */
  error: string;
  /**Uses the key provided, auto generated from full_path */
  key: string;
  /**Required if type is component, completelly undetected by Formik */
  component: undefined | JSX.Element;
  /**Full path of the input used for Formik */
  full_path: string;
  /**Placement of the label */
  labelPlacement: placement;
  /**Placement of the helperText */
  helperTextPlacement: placement;
  /**Placement of the errorText */
  errorTextPlacement: placement;
  /**Places labels, input, helpertext and errorText along a row */
  row: boolean;
}

export type FormSchemeInputPartial = { name: string } & Partial<
  FormSchemeInputFull
>;

export type FormSchemeInputsPartial = FormSchemeInputPartial[];
export type FormSchemeInputsFull = FormSchemeInputFull[];

export interface FormSchemePropsFull {
  /**Inputs passed to the FormScheme */
  inputs: FormSchemeInputsFull;
  /**Whether or not formButtons should be used */
  formButtons: boolean;
  /**Custom classnames of the form */
  classNames: undefined | string;
  /**Whether or not errors should be populated without touching the input */
  errorBeforeTouched: boolean;
  /**Submit text */
  submitMsg: string;
  /**Reset text */
  resetMsg: string;
  /**Show submit button */
  submitButton: boolean;
  /**Show reset button */
  resetButton: boolean;
  /**Disable the whole form */
  disabled: boolean;
  /**Time in ms the form is locked after submitting */
  submitTimeout: undefined | number;
  /**Treeview expand icon */
  treeViewExpandIcon: JSX.Element;
  /**Treeview collapse icon */
  treeViewCollapseIcon: JSX.Element;
  /**Center the form buttons */
  centerButtons: boolean;
}

export interface FormSchemeAllPropsFull<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>;
  FORMSCHEME_PROPS: FormSchemePropsFull;
  children: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
}

export type FormSchemeAllPropsPartial<Values> = {
  FORMIK_CONFIGS?: FormikConfig<Values>;
  FORMSCHEME_PROPS: { inputs: FormSchemeInputsPartial } & Partial<
    FormSchemePropsFull
  >;
  children?: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
};

export interface FormPropsPartial<Values>
  extends FormSchemeAllPropsPartial<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}

export interface FormPropsFull<Values> extends FormSchemeAllPropsFull<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}
