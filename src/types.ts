import * as Yup from "yup";
import { ReactElement, ReactNode } from 'react';
import { FormikTouched, FormikValues } from 'formik/dist/types';

export type FormElementType = 'checkbox' | 'select' | 'multiselect' | 'radio' | 'group' | 'text' | 'number' | 'component';

export interface FormSchemeInput {
  disabled: boolean,
  className: string | string[],
  children: null | FormSchemeInputs,
  type: FormElementType,
  helperText: undefined | string,
  errorText: undefined | string,
  defaultValue: any,
  label: undefined | string,
  name: string,
  extra: {
    append: boolean,
    useArray: boolean
  }
}

export type FormSchemeInputs = FormSchemeInput[];

export interface InputFormProps {
  validationSchema: Yup.ObjectSchema,
  inputs: FormSchemeInputs,
  onSubmit: () => any,
  customHandler: () => any,
  formButtons: boolean,
  classNames: string | string[],
  validateOnMount: boolean,
  errorBeforeTouched: boolean,
  submitMsg: string | undefined,
  children: ReactNode | ((props: any) => ReactElement<any> | null),
  passFormAsProp: boolean,
  initialTouched: FormikTouched<FormikValues>,
  disabled: boolean,
}