import {
  FormSchemeInputFull,
  FormSchemeInputPartial,
  FormSchemePropsPartial,
  FormSchemePropsFull,
} from '../types';

function setObjectValues(
  parent: any,
  arr: (string | [string, any | undefined])[],
  against?: any
) {
  arr.forEach(entry => {
    if (Array.isArray(entry)) {
      if (against ? !against[entry[0]] : !parent[entry[0]])
        parent[entry[0]] = entry[1];
    } else if (against ? !against[entry] : !parent[entry])
      parent[entry] = undefined;
  });
}

export function generateFormSchemeInputDefaultConfigs(
  input: FormSchemeInputPartial,
  index: number | undefined
) {
  if (!input.extra) input.extra = {};

  if (input.type === 'group') {
    if (!input.children || input.children.length === 0)
      throw new Error('Grouped FormScheme must have children components');
    setObjectValues(input.extra, [
      ['treeView', true],
      ['collapse', false],
      ['append', true],
    ]);
  } else {
    input.children = [];
    setObjectValues(input.extra, ['treeView', 'collapse', 'append']);
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
  ]);

  if (!input.label)
    input.label = input.name
      .split('_')
      .map((c: string) => c.charAt(0).toUpperCase() + c.substr(1))
      .join(' ');

  setObjectValues(input.extra, [
    ['useObject', true],
    ['useArray', false],
    ['selectItems', []],
    ['radioItems', []],
    'row',
    'min',
    'max',
    'step',
    'component',
  ]);

  if (!input.key) input.key = index ? input.name + index : input.name;

  if (input.type === 'radio' && (input?.extra?.radioItems ?? [])?.length === 0)
    throw new Error('Radio component must have radio items');
  if (
    input.type === 'select' &&
    (input?.extra?.selectItems ?? [])?.length === 0
  )
    throw new Error('Select component must have select items');

  return input as FormSchemeInputFull;
}

export function generateFormSchemePropsDefaultConfigs(
  props: FormSchemePropsPartial<Record<string, any>>
) {
  const res: any = {};
  res.inputs = props.inputs;
  setObjectValues(
    res,
    [
      'customHandler',
      ['formButtons', true],
      'classNames',
      'children',
      ['passFormAsProp', true],
      ['errorBeforeTouched', true],
      ['submitMsg', 'submit'],
      ['resetMsg', 'reset'],
      ['disabled', false],
    ],
    props
  );
  return res as FormSchemePropsFull<Record<string, any>>;
}
