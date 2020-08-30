import {
  FormSchemeInputFull,
  FormSchemeInputPartial,
  FormSchemePropsPartial,
  FormSchemePropsFull,
} from '../types';

export function generateFormSchemeInputDefaultConfigs(
  input: FormSchemeInputPartial,
  index: number | undefined
) {
  if (
    input.type === 'group' &&
    (!input.children || input.children.length === 0)
  )
    throw new Error('Grouped FormScheme must have childrens');
  else input.children = [];
  if (!input.name) throw new Error('Input name is required');
  if (!input.disabled) input.disabled = false;
  if (!input.className) input.className = undefined;
  if (!input.placeholder) input.placeholder = undefined;
  if (!input.helperText) input.helperText = undefined;
  if (!input.errorText) input.errorText = undefined;
  if (!input.defaultValue) input.defaultValue = undefined;
  if (!input.type) input.type = 'text';
  if (!input.controlled) input.controlled = true;
  if (!input.label)
    input.label = input.name
      .split('_')
      .map((c: string) => c.charAt(0).toUpperCase() + c.substr(1))
      .join(' ');
  if (!input.siblings) input.siblings = [];
  if (!input.onKeyPress) input.onKeyPress = undefined;
  if (!input.fieldHandler) input.fieldHandler = undefined;
  if (!input.extra) input.extra = {};
  if (!input.extra.append) input.extra.append = true;
  if (!input.extra.useArray) input.extra.useArray = false;
  if (!input.extra.selectItems) input.extra.selectItems = [];
  if (!input.extra.radioItems) input.extra.radioItems = [];
  if (!input.extra.row) input.extra.row = undefined;
  if (!input.extra.groupType) input.extra.groupType = undefined;
  if (!input.extra.treeView) input.extra.treeView = undefined;
  if (!input.extra.collapse) input.extra.collapse = undefined;
  if (!input.extra.min) input.extra.min = undefined;
  if (!input.extra.max) input.extra.max = undefined;
  if (!input.extra.step) input.extra.step = undefined;
  if (!input.key) input.key = index ? input.name + index : input.name;
  if (!input.component) input.component = undefined;

  if (input.type === 'radio' && input.extra.radioItems.length === 0)
    throw new Error('Radio component must have radio items');
  if (input.type === 'select' && input.extra.selectItems.length === 0)
    throw new Error('Select component must have select items');

  return input as FormSchemeInputFull;
}

export function generateFormSchemePropsDefaultConfigs(
  props: FormSchemePropsPartial<Record<string, any>>
) {
  const res: any = {};
  res.inputs = props.inputs;
  if (!props.customHandler) res.customHandler = undefined;
  if (!props.formButtons) res.formButtons = true;
  if (!props.classNames) res.classNames = undefined;
  if (!props.errorBeforeTouched) res.errorBeforeTouched = true;
  if (!props.submitMsg) res.submitMsg = 'submit';
  if (!props.resetMsg) res.resetMsg = 'reset';
  if (!props.children) res.children = undefined;
  if (!props.passFormAsProp) res.passFormAsProp = true;
  if (!props.disabled) res.disabled = false;
  return res as FormSchemePropsFull<Record<string, any>>;
}
