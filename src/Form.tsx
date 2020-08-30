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
  const change = (
    fieldHandler: (arg: any) => any,
    parent: Record<string, any>,
    e: BaseSyntheticEvent
  ) => {
    const { setValues, customHandler, setFieldTouched } = props;
    if (e.persist) e.persist();
    parent[e.target.name] = e.target.value || e.target.checked;
    setValues({ ...values });
    if (fieldHandler) fieldHandler(e.target.value);
    if (customHandler) customHandler(values, setValues, e);
    setFieldTouched(e.target.name, true, false);
  };

  const formikProps = (
    input: FormSchemeInputFull,
    parent: Record<string, any>
  ) => {
    const { handleBlur } = props;
    const {
      disabled,
      name,
      label,
      placeholder,
      controlled,
      onKeyPress,
      fieldHandler,
    } = input;
    if (controlled)
      return {
        name,
        value: parent[name],
        onChange: change.bind(null, fieldHandler, parent),
        onBlur: handleBlur,
        label,
        placeholder,
        disabled,
      };
    else
      return {
        name,
        onKeyPress,
        onChange: fieldHandler,
        label,
      };
  };

  const renderFormComponent = (
    input: FormSchemeInputFull,
    parent: Record<string, any>
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
    } = input;
    if (type === 'component') return component;
    else if (type === 'select')
      return (
        <FormControl key={key} disabled={disabled ? disabled : false} fullWidth>
          {!disabled ? (
            <Fragment>
              <InputLabel id={name}>{label}</InputLabel>
              <Select
                name={name}
                value={parent[name]}
                onChange={change.bind(null, fieldHandler, parent)}
              >
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
        value={parent[name]}
        min={min}
        max={max}
        step={step}
        ValueLabelComponent={ValueLabelComponent}
        onChangeCommitted={change.bind(null, fieldHandler, parent)}
        name={name}
      />;
    else if (type === 'checkbox')
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              color={'primary'}
              checked={parent[name] === true ? true : false}
              name={name}
              onChange={change.bind(null, fieldHandler, parent)}
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
          <RadioGroup
            row
            {...formikProps(input, parent)}
            defaultValue={defaultValue}
          >
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
          {...formikProps(input, parent)}
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
          {...formikProps(input, parent)}
          fullWidth
        />
      );
    else
      return (
        <TextField
          type={'text'}
          {...formikProps(input, parent)}
          fullWidth
          key={key}
        />
      );
  };

  const formComponentRenderer = (
    input: FormSchemeInputFull,
    parent: Record<string, any>
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
                  {children.map(child =>
                    formComponentRenderer(child, parent[name])
                  )}
                </FormGroup>
              </TreeItem>
            </TreeView>
          ) : (
            <FormGroup row={true}>
              {children.map(child =>
                formComponentRenderer(child, parent[name])
              )}
            </FormGroup>
          )
        ) : (
          renderFormComponent(input, parent)
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
        {inputs.map(input => formComponentRenderer(input, values))}
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
