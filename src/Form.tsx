import React, { Fragment, BaseSyntheticEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import { FormPropsFull, FormSchemeInputFull } from './types';

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

function Form(props: FormPropsFull<Record<string, any>>) {
  const renderFormGroupItem = (
    input: FormSchemeInputFull,
    attacher: Record<string, any>,
    parent: undefined | FormSchemeInputFull,
    index: number
  ) => {
    const { handleBlur } = props;
    const {
      name,
      label,
      defaultValue,
      type = 'text',
      disabled,
      fieldHandler,
      component,
      extra: { min, max, step, selectItems, radioItems, row },
      key,
      placeholder,
      controlled,
      onKeyPress,
    } = input;
    const value =
      parent && parent.extra.useArray ? attacher[index] : attacher[name];
    let generated_props = null;
    const onChange = (e: BaseSyntheticEvent) => {
      const { setValues, customHandler, setFieldTouched } = props;
      if (e.persist) e.persist();
      attacher[parent && parent.extra.useArray ? index : e.target.name] =
        typeof e.target.value !== 'undefined'
          ? e.target.value
          : e.target.checked;
      setValues({ ...values });
      if (fieldHandler) fieldHandler(e.target.value);
      if (customHandler) customHandler(values, setValues, e);
      setFieldTouched(e.target.name, true, false);
    };

    if (controlled)
      generated_props = {
        name,
        value: attacher[name],
        onChange,
        onBlur: handleBlur,
        label,
        placeholder,
        disabled,
      };
    else
      generated_props = {
        name,
        onKeyPress,
        onChange: fieldHandler,
        label,
      };

    if (type === 'component') return component;
    else if (type === 'select')
      return (
        <FormControl
          key={key}
          disabled={disabled ? disabled : false}
          fullWidth
          className={'FormScheme-content-container-component-select'}
        >
          {!disabled ? (
            <Fragment>
              <InputLabel id={name}>{label}</InputLabel>
              <Select name={name} value={value} onChange={onChange}>
                {selectItems.map(({ value, label, icon }) => {
                  return (
                    <MenuItem key={value || label} value={value || label}>
                      {icon ? <Icon>{icon}</Icon> : null}
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Fragment>
          ) : null}
        </FormControl>
      );
    else if (type === 'slider')
      <Slider
        key={key}
        value={value}
        min={min}
        max={max}
        step={step}
        ValueLabelComponent={ValueLabelComponent}
        onChangeCommitted={onChange}
        name={name}
        className={'FormScheme-content-container-component-slider'}
      />;
    else if (type === 'checkbox')
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              color={'primary'}
              checked={value === true}
              name={name}
              onChange={onChange}
              onBlur={handleBlur}
            />
          }
          label={label}
          className={'FormScheme-content-container-component-checkbox'}
        />
      );
    else if (type === 'radio')
      return (
        <FormControl
          key={key}
          className={'FormScheme-content-container-component-radio'}
        >
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup row {...generated_props} defaultValue={defaultValue}>
            {radioItems.map(({ label, value }) => (
              <FormControlLabel
                key={value}
                control={<Radio color="primary" />}
                value={value}
                label={label}
                labelPlacement="end"
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    else if (type === 'number')
      return (
        <TextField
          key={key}
          defaultValue={defaultValue}
          type={'number'}
          {...generated_props}
          fullWidth
          className={'FormScheme-content-container-component-number'}
        />
      );
    else if (type === 'textarea')
      return (
        <TextField
          key={key}
          type={'text'}
          multiline
          rows={row || 5}
          {...generated_props}
          fullWidth
          className={'FormScheme-content-container-component-textarea'}
        />
      );
    else
      return (
        <TextField
          type={'text'}
          {...generated_props}
          fullWidth
          key={key}
          className={'FormScheme-content-container-component-text'}
        />
      );
  };

  const renderFormGroup = (
    input: FormSchemeInputFull,
    attacher: Record<string, any>,
    parent: undefined | FormSchemeInputFull,
    index: number
  ) => {
    const {
      key,
      children,
      type,
      helperText,
      errorText,
      className,
      label,
      extra,
      name,
    } = input;
    return (
      <div className={className || `FormScheme-content-container`} key={key}>
        <div className={'FormScheme-content-container-label'}>{label}</div>
        {helperText ? (
          <FormHelperText className={'FormScheme-content-container-helpertext'}>
            {helperText}
          </FormHelperText>
        ) : null}
        {errorText ? (
          <FormHelperText
            className={'FormScheme-content-container-errorText'}
            error={true}
          >
            {errorText}
          </FormHelperText>
        ) : null}
        {type === 'group' ? (
          <div className={'FormScheme-content-container-group'}>
            {extra.treeView ? (
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={[extra.collapse ? '0' : '1']}
                /*               onNodeToggle={e => {
                  console.log(
                    (e.target as any).parentElement.parentElement.classList.contains(
                      'Mui-expanded'
                    )
                  );
                }} */
              >
                <TreeItem nodeId="1" label={label}>
                  <FormGroup row={false}>
                    {children.map((child, index) =>
                      renderFormGroup(child, attacher[name], input, index)
                    )}
                  </FormGroup>
                </TreeItem>
              </TreeView>
            ) : (
              <FormGroup row={true}>
                {children.map((child, index) =>
                  renderFormGroup(child, attacher[name], input, index)
                )}
              </FormGroup>
            )}
          </div>
        ) : (
          <div className={'FormScheme-content-container-component'}>
            {renderFormGroupItem(input, attacher, parent, index)}
          </div>
        )}
      </div>
    );
  };

  const {
    handleSubmit,
    isValid,
    isSubmitting,
    submitMsg,
    inputs,
    children,
    resetMsg,
    handleReset,
    formButtons,
    classNames,
    disabled,
    values,
  } = props;

  return (
    <form
      className={classNames || `Formscheme`}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <div className={`Formscheme-content`}>
        {inputs.map((input, index) =>
          renderFormGroup(input, values, undefined, index)
        )}
        {children}
      </div>
      <div className={`Formscheme-buttons`}>
        {formButtons ? (
          <FormGroup row={true}>
            <Button
              variant="contained"
              color="default"
              type="reset"
              className={'Formscheme-buttons-reset'}
            >
              {resetMsg}
            </Button>
            <Button
              className={'Formscheme-buttons-submit'}
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !isValid || disabled}
            >
              {submitMsg}
            </Button>
          </FormGroup>
        ) : null}
      </div>
    </form>
  );
}

export default Form;
