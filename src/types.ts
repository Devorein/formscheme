import { ReactElement, ReactNode, BaseSyntheticEvent } from 'react';
import {
  FormikConfig,
  FormikProps,
} from 'formik/dist/types';

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
  | 'textarea';

export interface SelectItems {
  value: any;
  label: string;
  icon: any;
}

export interface RadioItems {
  value: any;
  label: string;
}

export interface FormSchemeInputFull {
  disabled: boolean;
  className: string | undefined;
  children: FormSchemeInputsFull;
  placeholder: string;
  type: FormElementType;
  helperText: undefined | string;
  errorText: undefined | string;
  defaultValue: any;
  label: undefined | string;
  name: string;
  controlled: boolean;
  onKeyPress: () => any;
  fieldHandler: (value: any) => any;
  siblings: FormSchemeInputFull[];
  extra: {
    useObject: boolean;
    useArray: boolean;
    selectItems: SelectItems[];
    radioItems: RadioItems[];
    row: number;
    treeView: boolean;
    collapse: boolean;
    min: number;
    max: number;
    step: number;
    append: boolean;
  };
  key: string;
  component: JSX.Element;
}

export interface FormSchemeInputPartial {
  disabled?: boolean;
  className?: string;
  children?: FormSchemeInputsPartial;
  placeholder?: string;
  type?: FormElementType;
  helperText?: undefined | string;
  errorText?: undefined | string;
  defaultValue?: string;
  label: undefined | string;
  name: string;
  controlled?: boolean;
  onKeyPress?: () => any;
  fieldHandler?: (value: any) => any;
  siblings?: FormSchemeInputPartial[];
  extra?: {
    useObject?: boolean;
    useArray?: boolean;
    selectItems?: SelectItems[];
    radioItems?: RadioItems[];
    row?: number;
    treeView?: boolean;
    collapse?: boolean;
    min?: number;
    max?: number;
    step?: number;
    append?: boolean;
  };
  key?: string;
  component?: JSX.Element;
}

export type FormSchemeInputsPartial = FormSchemeInputPartial[];
export type FormSchemeInputsFull = FormSchemeInputFull[];

export interface FormSchemePropsPartial<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>,
  FORMSCHEME_PROPS: {
    inputs: FormSchemeInputsPartial;
    customHandler?: (
      values: Values,
      setValues: (
        values: Values,
        shouldValidate?: boolean | undefined
      ) => void,
      e: BaseSyntheticEvent
    ) => any;
    formButtons?: boolean;
    classNames?: string;
    errorBeforeTouched?: boolean;
    submitMsg?: string;
    resetMsg?: string;
    passFormAsProp?: boolean;
    disabled?: boolean;
  },
  children?: ReactNode | ((props: any) => ReactElement<any> | null);
}

export interface FormSchemePropsFull<Values> {
  FORMIK_CONFIGS: FormikConfig<Values>,
  FORMSCHEME_PROPS: {
    inputs: FormSchemeInputsFull;
    customHandler: undefined
    | ((
      values: Record<string, any>,
      setValues: (
        values: Record<string, any>,
        shouldValidate?: boolean | undefined
      ) => void,
      e: BaseSyntheticEvent
    ) => any);
    formButtons: boolean;
    classNames: undefined | string;
    errorBeforeTouched: boolean;
    submitMsg: string;
    resetMsg: string;
    passFormAsProp: boolean;
    disabled: boolean;
  },
  children: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
}

export interface FormPropsPartial<Values>
  extends FormSchemePropsPartial<Values> {
  FORMIK_PROPS: FormikProps<Values>
}

export interface FormPropsFull<Values>
  extends FormSchemePropsFull<Values> {
  FORMIK_PROPS: FormikProps<Values>
}
