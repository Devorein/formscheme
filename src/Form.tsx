import React, { BaseSyntheticEvent } from 'react';
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
import MenuItem from '@material-ui/core/MenuItem';
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
    const { handleBlur } = props.FORMIK_PROPS;
    const {
      name,
      label,
      type,
      disabled,
      fieldHandler,
      component,
      extra: { min, max, step, selectItems, radioItems, row },
      key,
      placeholder,
      controlled,
      onKeyPress,
      className,
    } = input;
    const value =
      parent && parent.extra.useArray ? attacher[index] : attacher[name];
    let generated_props = null;

    const {
      FORMIK_PROPS: { setValues, values, setFieldTouched },
      FORMSCHEME_PROPS: { customHandler },
    } = props;

    const onChange = (e: BaseSyntheticEvent) => {
      if (e.persist) e.persist();
      attacher[parent && parent.extra.useArray ? index : e.target.name] =
        type !== 'checkbox' ? e.target.value : e.target.checked;
      setValues({ ...values });
      if (fieldHandler) fieldHandler(e.target.value);
      if (customHandler) customHandler(values, setValues, e);
      setFieldTouched(e.target.name, true, false);
    };

    if (controlled)
      generated_props = {
        name,
        value,
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
        <Select
          name={name}
          value={value}
          onChange={onChange}
          className={
            className || 'FormScheme-content-container-component-select'
          }
        >
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
    else if (type === 'slider')
      return (
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          ValueLabelComponent={ValueLabelComponent}
          onChangeCommitted={(_, value) => {
            attacher[parent && parent.extra.useArray ? index : name] = value;
            setValues({ ...values });
          }}
          name={name}
          className={
            className || 'FormScheme-content-container-component-slider'
          }
        />
      );
    else if (type === 'checkbox')
      return (
        <Checkbox
          className={
            className || 'FormScheme-content-container-component-checkbox'
          }
          color={'primary'}
          checked={value === true}
          name={name}
          onChange={onChange}
          onBlur={handleBlur}
        />
      );
    else if (type === 'radio')
      return (
        <RadioGroup
          row
          {...generated_props}
          className={
            className || 'FormScheme-content-container-component-radio'
          }
        >
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
    else if (type === 'number')
      return (
        <TextField
          type={'number'}
          inputProps={{
            min,
            max,
            step,
          }}
          {...generated_props}
          fullWidth
          className={
            className || 'FormScheme-content-container-component-number'
          }
        />
      );
    else if (type === 'textarea')
      return (
        <TextField
          type={'text'}
          multiline
          rows={row}
          {...generated_props}
          fullWidth
          className={
            className || 'FormScheme-content-container-component-textarea'
          }
        />
      );
    else
      return (
        <TextField
          type={'text'}
          {...generated_props}
          fullWidth
          className={className || 'FormScheme-content-container-component-text'}
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
      disabled,
    } = input;
    return (
      <FormControl
        component="fieldset"
        className={className || `FormScheme-content-container`}
        key={key}
        disabled={disabled || false}
      >
        <FormLabel component="legend">{label}</FormLabel>
        {helperText && (
          <FormHelperText className={'FormScheme-content-container-helpertext'}>
            {helperText}
          </FormHelperText>
        )}
        {errorText && (
          <FormHelperText
            className={'FormScheme-content-container-errorText'}
            error={true}
          >
            {errorText}
          </FormHelperText>
        )}
        {type === 'group' ? (
          extra.treeView ? (
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultExpanded={[extra.collapse ? '0' : '1']}
              onNodeToggle={e => {
                const parent = (e.target as any).parentElement;
                parent.lastElementChild.textContent = !parent.nextElementSibling
                  ? 'Collapse'
                  : 'Expand';
              }}
            >
              <TreeItem
                nodeId="1"
                label={extra.collapse ? 'Expand' : 'Collapse'}
              >
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
          )
        ) : (
          renderFormGroupItem(input, attacher, parent, index)
        )}
      </FormControl>
    );
  };

  const {
    FORMIK_PROPS: {
      handleSubmit,
      isValid,
      isSubmitting,
      handleReset,
      values,
      setSubmitting,
    },
    FORMSCHEME_PROPS: {
      inputs,
      submitMsg,
      resetMsg,
      formButtons,
      classNames,
      disabled,
      submitTimeout,
    },
    children,
  } = props;
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
              disabled={disabled}
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
