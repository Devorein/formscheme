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
    against = against || parent;
    const should_add = against
      ? typeof against[entry[0]] === 'undefined'
      : typeof parent[entry[0]] === 'undefined';
    if (Array.isArray(entry)) {
      if (should_add) parent[entry[0]] = entry[1];
    } else if (should_add) parent[entry] = undefined;
  });
}

export function generateFormSchemeInputDefaultConfigs(
  input: FormSchemeInputPartial,
  parents: FormSchemeInputFull[] = [],
  index: number | undefined = 0
) {
  if (!input.extra) input.extra = {};

  if (input.type === 'group') {
    if (!input.children || input.children.length === 0)
      throw new Error('Grouped FormScheme must have children components');
    setObjectValues(input.extra, [
      ['useArray', false],
      ['useObject', input.extra.useArray ? false : true],
      ['treeView', true],
      ['collapse', false],
      ['append', true],
    ]);
  } else {
    input.children = [];
    setObjectValues(input.extra, [
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
  ]);

  if (!input.label)
    input.label = input.name
      .split('_')
      .map((c: string) => c.charAt(0).toUpperCase() + c.substr(1))
      .join(' ');

  setObjectValues(input.extra, [
    ['selectItems', []],
    ['radioItems', []],
    'row',
    'min',
    'max',
    'step',
    'component',
  ]);
  const full_path = parents
    .reduce((acc, parent) => acc.concat(parent.name), [] as any[])
    .join('.');
  if (!input.key) input.key = (full_path || '') + input.name + index;

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
  res.onSubmit = props.onSubmit;
  res.onReset = props.onReset;
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
