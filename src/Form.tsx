import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import { FormPropsFull, FormSchemeInputFull } from './types';
import { Field } from 'formik';

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

function Form(props: FormPropsFull<Record<string, any>>) {
  const {
    FORMIK_PROPS: {
      handleSubmit,
      dirty,
      isValid,
      isSubmitting,
      handleReset,
      setSubmitting,
      handleChange,
      handleBlur,
      getFieldMeta,
    },
    FORMSCHEME_PROPS: {
      inputs,
      submitMsg,
      resetMsg,
      formButtons,
      resetButton,
      submitButton,
      classNames,
      disabled: form_disabled,
      submitTimeout,
      treeViewCollapseIcon,
      treeViewExpandIcon,
      centerButtons,
    },
    children,
  } = props;

  const renderFormGroupItem = (input: FormSchemeInputFull) => {
    const {
      type,
      disabled,
      fieldHandler,
      component,
      input_props,
      selectItems,
      radioItems,
      key,
      controlled,
      onKeyPress,
      className,
      full_path,
    } = input;
    const { value } = getFieldMeta(full_path);

    const common_props: any = {
      name: full_path,
      value,
      onBlur: handleBlur,
      disabled,
      className: className || `FormScheme-content-container-component-${type}`,
    };

    if (type !== 'slider') common_props.onChange = handleChange;

    if (!controlled) {
      common_props.onKeyPress = onKeyPress;
      common_props.onChange = fieldHandler;
    }
    switch (type) {
      case 'component':
        return component;
      case 'select':
        return (
          <Select {...common_props} {...input_props}>
            {selectItems.map(({ value, label, icon }, index) => {
              return (
                <MenuItem key={key + label + index} value={value}>
                  {icon ? <Icon>{icon}</Icon> : null}
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        );
      case 'slider':
        return (
          <Slider
            ValueLabelComponent={ValueLabelComponent}
            onChangeCommitted={(e, value) => {
              (e.target as any).value = value;
              handleChange(e);
            }}
            {...common_props}
            {...input_props}
          />
        );
      case 'checkbox':
        return (
          <Field
            as={Checkbox}
            name={full_path}
            type={'checkbox'}
            color={'primary'}
            {...input_props}
          />
        );
      case 'switch':
        return (
          <Field
            as={Switch}
            name={full_path}
            type={'checkbox'}
            color={'primary'}
            {...input_props}
          />
        );
      case 'radio':
        return (
          <RadioGroup row {...common_props} {...input_props}>
            {radioItems.map(({ label, value }, index) => (
              <FormControlLabel
                key={key + label + index}
                control={<Radio color="primary" />}
                value={value}
                label={label}
                labelPlacement="end"
              />
            ))}
          </RadioGroup>
        );
      case 'number':
        return (
          <TextField
            type={'number'}
            fullWidth
            {...common_props}
            {...input_props}
          />
        );

      default:
        return (
          <TextField
            type={'text'}
            multiline={type === 'textarea'}
            fullWidth
            {...common_props}
            {...input_props}
          />
        );
    }
  };

  const renderFormGroup = (
    input: FormSchemeInputFull,
    parent: undefined | FormSchemeInputFull
  ) => {
    const {
      key,
      children,
      type,
      helperText,
      className,
      label,
      treeView,
      collapse,
      labelPlacement,
      helperTextPlacement,
      // errorTextPlacement,
      // full_path
    } = input;
    input.disabled = parent?.disabled || input.disabled;
    input.required = parent?.required || input.required;
    const { disabled, required } = input;
    // const { error } = getFieldMeta(full_path);

    if (disabled && required)
      throw new Error('Required fields cannot be disabled');
    return (
      <FormControl
        className={className || `FormScheme-content-container`}
        key={key}
        disabled={disabled}
        fullWidth
        margin={'normal'}
      >
        <FormLabel
          style={{
            display: 'flex',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            justifyContent: labelPlacement,
          }}
          disabled={disabled}
          required={required}
          component="label"
        >
          {label}
        </FormLabel>
        {helperText && (
          <FormHelperText
            required={required}
            disabled={disabled}
            className={'FormScheme-content-container-helpertext'}
            style={{
              display: 'flex',
              fontSize: '1rem',
              justifyContent: helperTextPlacement,
            }}
          >
            {helperText}
          </FormHelperText>
        )}
        {type === 'group' ? (
          treeView ? (
            <TreeView
              defaultCollapseIcon={treeViewCollapseIcon}
              defaultExpandIcon={treeViewExpandIcon}
              defaultExpanded={[collapse ? '0' : '1']}
              onNodeToggle={e => {
                const parent = (e.target as any).parentElement.parentElement;
                (e.target as any).textContent = !parent.nextElementSibling
                  ? 'Collapse'
                  : 'Expand';
              }}
            >
              <TreeItem
                nodeId="1"
                label={
                  <div style={{ width: 'calc(100% - 25px)' }}>
                    {collapse ? 'Expand' : 'Collapse'}
                  </div>
                }
              >
                <FormGroup row={false}>
                  {children.map(child => renderFormGroup(child, input))}
                </FormGroup>
              </TreeItem>
            </TreeView>
          ) : (
            <FormGroup row={true}>
              {children.map(child => renderFormGroup(child, input))}
            </FormGroup>
          )
        ) : (
          renderFormGroupItem(input)
        )}
        {/*         {error && (
          <FormHelperText
            className={'FormScheme-content-container-errorText'}
            error={true}
            disabled={disabled}
          >
            {error}
          </FormHelperText>
        )} */}
      </FormControl>
    );
  };

  return (
    <form
      className={classNames || `Formscheme`}
      onSubmit={e => {
        e.preventDefault();
        if (typeof submitTimeout === 'number') {
          setSubmitting(true);
          setTimeout(() => {
            handleSubmit();
            setSubmitting(false);
          }, submitTimeout);
        } else handleSubmit();
      }}
      onReset={() => {
        handleReset();
      }}
    >
      <div className={`Formscheme-content`}>
        {inputs.map(input => renderFormGroup(input, undefined))}
        {children}
      </div>
      <div className={`Formscheme-buttons`}>
        {formButtons && (
          <FormGroup
            row={true}
            style={
              centerButtons ? { width: 'fit-content', margin: '0 auto' } : {}
            }
          >
            {resetButton && (
              <Button
                style={{ margin: '10px' }}
                variant="contained"
                color="default"
                type="reset"
                disabled={form_disabled}
                className={'Formscheme-buttons-reset'}
              >
                {resetMsg}
              </Button>
            )}
            {submitButton && (
              <Button
                style={{ margin: '10px' }}
                className={'Formscheme-buttons-submit'}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || isSubmitting || !isValid || form_disabled}
              >
                {submitMsg}
              </Button>
            )}
          </FormGroup>
        )}
      </div>
    </form>
  );
}

export default Form;
