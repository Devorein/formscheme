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
  const renderFormComponent = (
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
        e.target.value || e.target.checked;
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
        <FormControl key={key} disabled={disabled ? disabled : false} fullWidth>
          {!disabled ? (
            <Fragment>
              <InputLabel id={name}>{label}</InputLabel>
              <Select name={name} value={value} onChange={onChange}>
                {selectItems.map(({ value, label, icon }) => {
                  return (
                    <MenuItem
                      key={value ? value : label}
                      value={value ? value : label}
                    >
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
      />;
    else if (type === 'checkbox')
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              color={'primary'}
              checked={value === true ? true : false}
              name={name}
              onChange={onChange}
              onBlur={handleBlur}
            />
          }
          label={label}
        />
      );
    else if (type === 'radio')
      return (
        <FormControl key={key}>
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
        />
      );
    else
      return (
        <TextField type={'text'} {...generated_props} fullWidth key={key} />
      );
  };

  const formComponentRenderer = (
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
      <div className={className} key={key}>
        <div>{label}</div>
        {helperText !== '' ? (
          <FormHelperText>{helperText}</FormHelperText>
        ) : null}
        {errorText !== '' ? (
          <FormHelperText error={true}>{errorText}</FormHelperText>
        ) : null}
        {type === 'group' ? (
          extra.treeView ? (
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultExpanded={[extra.collapse ? '0' : '1']}
            >
              <TreeItem nodeId="1" label={label}>
                <FormGroup row={false}>
                  {children.map((child, index) =>
                    formComponentRenderer(child, attacher[name], input, index)
                  )}
                </FormGroup>
              </TreeItem>
            </TreeView>
          ) : (
            <FormGroup row={true}>
              {children.map((child, index) =>
                formComponentRenderer(child, attacher[name], input, index)
              )}
            </FormGroup>
          )
        ) : (
          renderFormComponent(input, attacher, parent, index)
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
    resetForm,
    formButtons = true,
    classNames,
    disabled,
    values,
  } = props;

  return (
    <form
      className={`${classNames ? ' ' + classNames : ''} form`}
      onSubmit={handleSubmit}
    >
      <div className={`form-content`}>
        {inputs.map((input, index) =>
          formComponentRenderer(input, values, undefined, index)
        )}
        {children}
      </div>
      {formButtons ? (
        <FormGroup row={true}>
          <Button
            variant="contained"
            color="default"
            onClick={() => {
              resetForm();
            }}
          >
            {resetMsg || 'Reset'}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !isValid || disabled}
          >
            {submitMsg || 'Submit'}
          </Button>
        </FormGroup>
      ) : null}
    </form>
  );
}

export default Form;
