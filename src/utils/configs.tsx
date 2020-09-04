import {
  FormSchemeInputFull,
  FormSchemeInputPartial,
  FormSchemeAllPropsPartial,
  FormSchemeAllPropsFull,
} from '../types';
import React from 'react';

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
  full_path: string = '',
  parent: undefined | FormSchemeInputFull,
  index: number | undefined = 0
) {
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
  const placemant = input.type !== 'group' ? 'flex-start' : 'center';
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
    ['required', false],
    'error',
    ['items', []],
    ['row', false],
    ['labelPlacement', placemant],
    ['helperTextPlacement', placemant],
    ['errorTextPlacement', placemant],
  ]);

  input.disabled = parent?.disabled || input.disabled;
  input.required = parent?.required || input.required;

  if (!input.label)
    input.label = input.name
      .split('_')
      .map((c: string) => c.charAt(0).toUpperCase() + c.substr(1))
      .join(' ');

  if (!input.key) input.key = full_path + input.name + index;
  const key = parent && parent.useArray ? index : input.name;
  if (
    input?.type?.match(/(radio|select)/) &&
    (input?.items ?? [])?.length === 0
  )
    throw new Error(
      `${input.type.charAt(0).toUpperCase() +
        input.type.substr(1)} component must have ${input.type} items`
    );

  (input as FormSchemeInputFull).full_path =
    full_path + `${parent ? `.${key}` : key}`;
  return input as FormSchemeInputFull;
}

export function generateFormSchemePropsDefaultConfigs(
  props: FormSchemeAllPropsPartial<Record<string, any>>
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
    ['errorBeforeTouched', true],
    ['submitMsg', 'submit'],
    ['resetMsg', 'reset'],
    ['resetButton', true],
    ['submitButton', true],
    ['disabled', false],
    'submitTimeout',
    ['treeViewExpandIcon', <div>{'⯆'}</div>],
    ['treeViewCollapseIcon', <div>{'▶'}</div>],
    ['centerButtons', true],
  ]);
  return res as FormSchemeAllPropsFull<Record<string, any>>;
}
