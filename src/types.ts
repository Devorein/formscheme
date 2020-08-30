import { ReactElement, ReactNode, BaseSyntheticEvent } from 'react';
import {
  FormikTouched,
  FormikConfig,
  FormikProps,
  FormikErrors,
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
export type GroupType = 'checkbox' | 'select' | 'radio' | 'text' | 'number';
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
  fieldHandler: () => any;
  siblings: FormSchemeInputFull[];
  extra: {
    useObject: boolean;
    useArray: boolean;
    selectItems: SelectItems[];
    radioItems: RadioItems[];
    row: number;
    groupType: GroupType;
    treeView: boolean;
    collapse: boolean;
    min: number;
    max: number;
    step: number;
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
  fieldHandler?: () => any;
  siblings?: FormSchemeInputPartial[];
  extra?: {
    useObject?: boolean;
    useArray?: boolean;
    selectItems?: SelectItems[];
    radioItems?: RadioItems[];
    row?: number;
    groupType?: GroupType;
    treeView?: boolean;
    collapse?: boolean;
    min?: number;
    max?: number;
    step?: number;
  };
  key?: string;
  component?: JSX.Element;
}

export type FormSchemeInputsPartial = FormSchemeInputPartial[];
export type FormSchemeInputsFull = FormSchemeInputFull[];

export interface FormSchemePropsPartial<Values> extends FormikConfig<Values> {
  inputs: FormSchemeInputsPartial;
  customHandler?: (
    values: Record<string, any>,
    setValues: (
      values: Record<string, any>,
      shouldValidate?: boolean | undefined
    ) => void,
    e: BaseSyntheticEvent
  ) => any;
  formButtons?: boolean;
  classNames?: string;
  errorBeforeTouched?: boolean;
  submitMsg?: string;
  resetMsg?: string;
  children?: ReactNode | ((props: any) => ReactElement<any> | null);
  passFormAsProp?: boolean;
  disabled?: boolean;
}

export interface FormSchemePropsFull<Values> extends FormikConfig<Values> {
  inputs: FormSchemeInputsFull;
  customHandler:
  | undefined
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
  children: undefined | ReactNode | ((props: any) => ReactElement<any> | null);
  passFormAsProp: boolean;
  disabled: boolean;
}

export interface FormPropsPartial<Values>
  extends FormSchemePropsPartial<Values>,
  FormikProps<Values> {
  initialValues: Values;
  initialStatus?: any;
  initialErrors: FormikErrors<Values>;
  initialTouched: FormikTouched<Values>;
}

export interface FormPropsFull<Values>
  extends FormSchemePropsFull<Values>,
  FormikProps<Values> {
  initialValues: Values;
  initialStatus?: any;
  initialErrors: FormikErrors<Values>;
  initialTouched: FormikTouched<Values>;
}
