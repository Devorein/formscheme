import { ReactElement, ReactNode, BaseSyntheticEvent } from 'react';
import { FormikTouched, FormikConfig, FormikProps, FormikErrors } from 'formik/dist/types';

export type FormElementType = 'checkbox' | 'select' | 'multiselect' | 'radio' | 'group' | 'text' | 'number' | 'component' | 'slider' | 'textarea';
export type GroupType = 'checkbox' | 'select' | 'radio' | 'text' | 'number'
export interface SelectItems {
  value: any,
  label: string,
  icon: any
}

export interface RadioItems {
  value: any,
  label: string,
}

export interface FormSchemeInput {
  disabled: boolean,
  className: string | undefined,
  children: null | FormSchemeInputs,
  placeholder: string,
  type: FormElementType,
  helperText: undefined | string,
  errorText: undefined | string,
  defaultValue: any,
  label: undefined | string,
  name: string,
  controlled: boolean,
  onkeyPress: () => any,
  fieldHandler: () => any,
  siblings: FormSchemeInput[]
  extra: {
    append: boolean,
    useArray: boolean,
    selectItems: SelectItems[],
    radioItems: RadioItems[],
    row: number,
    groupType: GroupType,
    treeView: boolean,
    collapse: boolean,
    min: number,
    max: number,
    step: number
  },
  key: string,
  component: JSX.Element
}

export type FormSchemeInputs = FormSchemeInput[];

export interface InputFormProps<Values> extends FormikConfig<Values> {
  inputs: FormSchemeInputs,
  customHandler: (values: Record<string, any>, setValues: (values: Record<string, any>, shouldValidate?: boolean | undefined) => void, e: BaseSyntheticEvent) => any,
  formButtons: boolean,
  classNames: string | string[],
  errorBeforeTouched: boolean,
  submitMsg: string | undefined,
  resetMsg: string | undefined,
  children: ReactNode | ((props: any) => ReactElement<any> | null),
  passFormAsProp: boolean,
  disabled: boolean,
}

export interface FormProps<Values> extends InputFormProps<Values>, FormikProps<Values> {
  initialValues: Values,
  initialStatus?: any;
  initialErrors: FormikErrors<Values>;
  initialTouched: FormikTouched<Values>;
}