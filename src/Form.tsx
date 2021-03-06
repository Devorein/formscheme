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
import Input from '@material-ui/core/Input';
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
      formButtonsPlacement,
      errorBeforeTouched,
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
      items,
      key,
      controlled,
      onKeyPress,
      className,
      full_path,
      placeholder,
    } = input;
    const { value } = getFieldMeta(full_path);

    const common_props: any = {
      name: full_path,
      value,
      onBlur: handleBlur,
      disabled,
      className: className || `FormScheme-input-container-${type}`,
    };

    if (!type.match(/^(slider)$/)) common_props.onChange = handleChange;

    if (!controlled) {
      common_props.onKeyPress = onKeyPress;
      common_props.onChange = fieldHandler;
    }
    const labels: Record<string, any> = {};
    if (type.match(/(select|radio)/))
      items.forEach(item => (labels[item.value] = item.label));

    switch (type) {
      case 'component':
        return component;
      case 'select':
        return (
          <Select displayEmpty {...common_props} {...input_props}>
            <MenuItem value="">{'None'}</MenuItem>
            {items.map(({ value, label, icon }, index) => (
              <MenuItem key={key + label + index} value={value}>
                {icon ? <Icon>{icon}</Icon> : null}
                {label}
              </MenuItem>
            ))}
          </Select>
        );
      case 'multiselect':
        return (
          <Select
            multiple
            displayEmpty
            input={<Input />}
            renderValue={(selected: string[]) => {
              return selected.length === 0 ? (
                <span>None</span>
              ) : (
                selected
                  .filter(selected => selected !== '')
                  .map(selected => labels[selected])
                  .join(', ')
              );
            }}
            {...common_props}
            {...input_props}
          >
            <MenuItem disabled>
              <span>None</span>
            </MenuItem>
            {items.map(({ value, label, icon }, index) => {
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
            {items.map(({ label, value }, index) => (
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
            placeholder={placeholder}
            type={'number'}
            fullWidth
            {...common_props}
            {...input_props}
          />
        );

      default:
        return (
          <TextField
            placeholder={placeholder}
            type={'text'}
            multiline={type === 'textarea'}
            fullWidth
            {...common_props}
            {...input_props}
          />
        );
    }
  };

  const renderFormGroup = (input: FormSchemeInputFull) => {
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
      errorTextPlacement,
      full_path,
      row,
    } = input;
    const { disabled, required } = input;
    const { error, touched } = getFieldMeta(full_path);
    const show_error =
      type !== 'group' && error && (errorBeforeTouched || touched);
    if (disabled && required)
      throw new Error('Required fields cannot be disabled');
    return (
      <FormControl
        className={className || `FormScheme-input`}
        key={key}
        disabled={disabled}
        fullWidth
        margin={'normal'}
        style={{ flexDirection: row ? 'row' : 'column' }}
      >
        <div
          className="FormScheme-input-label_helpertext"
          style={{ marginRight: 10 }}
        >
          <FormLabel
            style={{
              display: 'flex',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              justifyContent: labelPlacement,
            }}
            className="FormScheme-input-label"
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
              className={'FormScheme-input-helpertext'}
              style={{
                display: 'flex',
                fontSize: '1rem',
                justifyContent: helperTextPlacement,
              }}
            >
              {helperText}
            </FormHelperText>
          )}
        </div>
        <div
          className="Formscheme-input-container"
          style={{ marginBottom: show_error ? 0 : 22.5 }}
        >
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
                    {children.map(child => renderFormGroup(child))}
                  </FormGroup>
                </TreeItem>
              </TreeView>
            ) : (
              <FormGroup row={true}>
                {children.map(child => renderFormGroup(child))}
              </FormGroup>
            )
          ) : (
            renderFormGroupItem(input)
          )}
        </div>

        {show_error && (
          <FormHelperText
            className={'FormScheme-input-errorText'}
            error={true}
            disabled={disabled}
            style={{
              display: 'flex',
              fontSize: '.75rem',
              fontWeight: 'bold',
              justifyContent: errorTextPlacement,
              alignItems: 'center',
              marginLeft: row ? 10 : 0,
            }}
          >
            {error}
          </FormHelperText>
        )}
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
      <div className={`Formscheme-inputs`}>
        {inputs.map(input => renderFormGroup(input))}
        {children}
      </div>
      <div
        className={`Formscheme-buttons`}
        style={{ display: 'flex', justifyContent: formButtonsPlacement }}
      >
        {formButtons && (
          <FormGroup
            row={true}
            style={{
              width: 'fit-content',
            }}
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
