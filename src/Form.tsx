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
  const {
    FORMIK_PROPS: {
      handleSubmit,
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
    },
    children,
  } = props;

  const renderFormGroupItem = (input: FormSchemeInputFull) => {
    const {
      name,
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
    const { value } = getFieldMeta(name);

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

    if (type === 'component') return component;
    else if (type === 'select')
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
    else if (type === 'slider')
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
    else if (type === 'checkbox')
      return (
        <Checkbox
          color={'primary'}
          checked={value === true}
          {...common_props}
          {...input_props}
        />
      );
    else if (type === 'radio')
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
    else if (type === 'number')
      return (
        <TextField
          type={'number'}
          fullWidth
          {...common_props}
          {...input_props}
        />
      );
    else
      return (
        <TextField
          type={'text'}
          multiline={type === 'textarea'}
          fullWidth
          {...common_props}
          {...input_props}
        />
      );
  };

  const renderFormGroup = (input: FormSchemeInputFull) => {
    const {
      key,
      children,
      type,
      helperText,
      errorText,
      className,
      label,
      disabled,
      treeView,
      collapse,
    } = input;
    return (
      <FormControl
        component="fieldset"
        className={className || `FormScheme-content-container`}
        key={key}
        disabled={disabled}
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
          treeView ? (
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultExpanded={[collapse ? '0' : '1']}
              onNodeToggle={e => {
                const parent = (e.target as any).parentElement;
                parent.lastElementChild.textContent = !parent.nextElementSibling
                  ? 'Collapse'
                  : 'Expand';
              }}
            >
              <TreeItem nodeId="1" label={collapse ? 'Expand' : 'Collapse'}>
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
        {inputs.map(input => renderFormGroup(input))}
        {children}
      </div>
      <div className={`Formscheme-buttons`}>
        {formButtons && (
          <FormGroup row={true}>
            {resetButton && (
              <Button
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
                className={'Formscheme-buttons-submit'}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !isValid || form_disabled}
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
