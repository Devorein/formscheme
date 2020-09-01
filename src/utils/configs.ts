import {
  FormSchemeInputFull,
  FormSchemeInputPartial,
  FormSchemePropsPartial,
  FormSchemePropsFull,
} from '../types';

function setObjectValues(
  parent: any,
  arr: (string | [string, any | undefined])[]
) {
  arr.forEach(entry => {
    if (Array.isArray(entry)) {
      if (typeof parent[entry[0]] === 'undefined') parent[entry[0]] = entry[1];
    } else if (typeof parent[entry] === 'undefined') parent[entry] = undefined;
  });
}

export function generateFormSchemeInputDefaultConfigs(
  input: FormSchemeInputPartial,
  parents: FormSchemeInputFull[] = [],
  index: number | undefined = 0
) {
  const parent = parents[parents.length - 1];
  if (!input.input_props) input.input_props = {};

  if (input.type === 'group') {
    if (!input.children || input.children.length === 0)
      throw new Error('Grouped FormScheme must have children components');
    setObjectValues(input, [
      ['useArray', false],
      ['useObject', input.useArray ? false : true],
      ['treeView', true],
      ['collapse', false],
      ['append', true],
    ]);
  } else {
    input.children = [];
    setObjectValues(input, [
      'treeView',
      'collapse',
      'append',
      'useArray',
      'useObject',
    ]);
  }

  if (!input.name) throw new Error('Input name is required');

  setObjectValues(input, [
    ['disabled', false],
    'className',
    'placeholder',
    'helperText',
    'defaultValue',
    ['type', 'text'],
    ['controlled', true],
    'onKeyPress',
    'fieldHandler',
    ['siblings', []],
    ['touched', false],
    ['selectItems', []],
    ['radioItems', []],
  ]);

  if (!input.label)
    input.label = input.name
      .split('_')
      .map((c: string) => c.charAt(0).toUpperCase() + c.substr(1))
      .join(' ');

  const full_path = parents
    .reduce((acc, parent) => acc.concat(parent.name), [] as any[])
    .join('.');
  if (!input.key) input.key = full_path + input.name + index;

  if (input.type === 'radio' && (input?.radioItems ?? [])?.length === 0)
    throw new Error('Radio component must have radio items');
  if (input.type === 'select' && (input?.selectItems ?? [])?.length === 0)
    throw new Error('Select component must have select items');
  (input as FormSchemeInputFull).full_path =
    full_path +
    `${
    parent ? (parent.useArray ? `[${index}]` : `.${input.name}`) : input.name
    }`;
  return input as FormSchemeInputFull;
}

export function generateFormSchemePropsDefaultConfigs(
  props: FormSchemePropsPartial<Record<string, any>>
) {
  const res: any = {
    FORMSCHEME_PROPS: {},
    FORMIK_CONFIGS: props.FORMIK_CONFIGS,
  };
  if (!props.FORMSCHEME_PROPS.inputs)
    throw new Error('You should pass inputs props to FORMSCHEME_PROPS');
  res.FORMSCHEME_PROPS = { ...props.FORMSCHEME_PROPS };

  setObjectValues(res.FORMSCHEME_PROPS, [
    ['formButtons', true],
    'classNames',
    ['passFormAsProp', true],
    ['errorBeforeTouched', true],
    ['submitMsg', 'submit'],
    ['resetMsg', 'reset'],
    ['resetButton', true],
    ['submitButton', true],
    ['disabled', false],
    ['required', true],
    'submitTimeout',
  ]);
  return res as FormSchemePropsFull<Record<string, any>>;
}
