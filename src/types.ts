import { ReactElement, ReactNode } from 'react';
import { FormikConfig, FormikProps } from 'formik/dist/types';

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

export type placement = 'center' | 'flex-start' | 'flex-end';

export interface Items {
  value: any;
  label: string;
  icon: any;
}

export interface FormSchemeInputFull {
  disabled: boolean;
  required: boolean;
  className: string | undefined;
  children: FormSchemeInputsFull;
  placeholder: string;
  type: FormElementType;
  helperText: undefined | string;
  defaultValue: any;
  label: undefined | string;
  name: string;
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
  error: boolean;
  key: string;
  component: JSX.Element;
  full_path: string;
  labelPlacement: placement;
  helperTextPlacement: placement;
  errorTextPlacement: placement;
}

export interface FormSchemeInputPartial {
  disabled?: boolean;
  className?: string;
  required?: boolean;
  children?: FormSchemeInputsPartial;
  placeholder?: string;
  type?: FormElementType;
  helperText?: undefined | string;
  defaultValue?: string;
  label: undefined | string;
  name: string;
  controlled?: boolean;
  onKeyPress?: () => any;
  fieldHandler?: (value: any) => any;
  siblings?: FormSchemeInputPartial[];
  useObject?: boolean;
  useArray?: boolean;
  items?: Items[];
  treeView?: boolean;
  collapse?: boolean;
  append?: boolean;
  input_props?: any;
  touched?: boolean;
  error?: boolean;
  key?: string;
  component?: JSX.Element;
  labelPlacement?: placement;
  helperTextPlacement?: placement;
  errorTextPlacement?: placement;
}

export type FormSchemeInputsPartial = FormSchemeInputPartial[];
export type FormSchemeInputsFull = FormSchemeInputFull[];

export interface FormSchemePropsPartial<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>;
  FORMSCHEME_PROPS: {
    inputs: FormSchemeInputsPartial;
    formButtons?: boolean;
    classNames?: string;
    errorBeforeTouched?: boolean;
    submitMsg?: string;
    submitButton?: true;
    resetMsg?: string;
    resetButton?: true;
    disabled?: boolean;
    submitTimeout?: number;
    treeViewExpandIcon?: JSX.Element;
    treeViewCollapseIcon?: JSX.Element;
    centerButtons?: boolean;
  };
  children?: ReactNode | ((props: any) => ReactElement<any> | null);
}

export interface FormSchemePropsFull<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>;
  FORMSCHEME_PROPS: {
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
  };
  children: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
}

export interface FormPropsPartial<Values>
  extends FormSchemePropsPartial<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}

export interface FormPropsFull<Values> extends FormSchemePropsFull<Values> {
  FORMIK_PROPS: FormikProps<Values>;
}
