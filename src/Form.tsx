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

// import CustomSlider from '../Input/Slider';
import { FormProps, FormSchemeInput } from './types';

import './Form.scss';

function ValueLabelComponent (props: any) {
	const { children, open, value } = props;
	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
}

function Form (props: FormProps<Record<string, any>>) {
	const decideLabel = (name: string, label: string | undefined) => {
		if (label) return label;
		else {
			const last_name = name.split('.');
			return last_name[last_name.length - 1]
				.split('_')
				.map((name) => name.charAt(0).toUpperCase() + name.substr(1))
				.join(' ');
		}
	};

	const change = (fieldHandler: (arg: any) => any, e: BaseSyntheticEvent) => {
		const { values, setValues, customHandler, setFieldTouched } = props;
		if (e.persist) e.persist();
		values[(e.target as any).name] = e.target.value || e.target.checked;
		setValues({ ...values });
		if (fieldHandler) fieldHandler((e.target as any).value);
		if (customHandler) customHandler(values, setValues, e);
		setFieldTouched(e.target.name, true, false);
	};

	const formikProps = (input: FormSchemeInput) => {
		const { values, handleBlur, touched, errors, errorBeforeTouched } = props;
		const { disabled, name, label, placeholder, controlled, onkeyPress, fieldHandler } = input;
		if (controlled)
			return {
				name,
				value: typeof values[name] === 'undefined' ? '' : values[name],
				onChange: change.bind(null, fieldHandler),
				onBlur: handleBlur,
				error: errorBeforeTouched ? Boolean(errors[name]) : touched[name] && Boolean(errors[name]),
				helperText: errorBeforeTouched ? errors[name] : touched[name] ? errors[name] : '',
				label,
				placeholder,
				disabled
			};
		else
			return {
				name,
				onkeyPress,
				onChange: fieldHandler,
				label: decideLabel(name, label)
			};
	};

	const renderFormComponent = (input: FormSchemeInput) => {
		const { values, handleBlur } = props;
		const {
			name,
			label,
			defaultValue,
			type = 'text',
			helperText,
			disabled,
			siblings,
			fieldHandler,
			component,
			extra: { min, max, step, selectItems, radioItems, row },
			key
		} = input;
		if (type === 'component') return component;
		else if (type === 'select') {
			if (!selectItems) throw new Error('Select component must have select items');
			return (
				<Fragment key={name}>
					<FormControl disabled={disabled ? disabled : false} fullWidth>
						{!disabled ? (
							<Fragment>
								<InputLabel id={name}>{decideLabel(name, label)}</InputLabel>
								<Select name={name} value={values[name]} onChange={change.bind(null, fieldHandler)}>
									{selectItems.map(({ value, label, icon }) => {
										return (
											<MenuItem key={value ? value : label} value={value ? value : label}>
												{icon ? <Icon>{icon}</Icon> : null}
												{label}
											</MenuItem>
										);
									})}
								</Select>
							</Fragment>
						) : null}
						{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
					</FormControl>
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		} else if (type === 'slider') {
			<Slider
				key={key}
				value={values[name]}
				min={min}
				max={max}
				step={step}
				ValueLabelComponent={ValueLabelComponent}
				onChangeCommitted={change.bind(null, fieldHandler)}
				name={name}
			/>;
		} else if (type === 'checkbox') {
			return (
				<Fragment key={name}>
					<FormControlLabel
						control={
							<Checkbox
								color={'primary'}
								checked={values[name] === true ? true : false}
								name={name}
								onChange={change.bind(null, fieldHandler)}
								onBlur={handleBlur}
								// error={touched[name] && errors[name]}
							/>
						}
						label={label}
					/>
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		} else if (type === 'radio') {
			const props = formikProps(input);
			if (!radioItems) throw new Error('Radio component must have radio items');
			delete props.helperText;
			delete props.error;
			return (
				<Fragment key={name}>
					<FormControl>
						<FormLabel component="legend">{label}</FormLabel>
						<RadioGroup row {...props} defaultValue={defaultValue}>
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
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		} else if (type === 'number')
			return (
				<Fragment key={name}>
					<TextField
						defaultValue={defaultValue}
						type={'number'}
						{...formikProps(input)}
						fullWidth
						// inputProps={{ ...inputProps }}
					/>
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else if (type === 'textarea')
			return (
				<Fragment key={name}>
					<TextField type={'text'} multiline rows={row || 5} {...formikProps(input)} fullWidth />
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else
			return (
				<Fragment key={name}>
					<TextField type={'text'} {...formikProps(input)} fullWidth />
					{siblings ? siblings.map((sibling) => formComponentRenderer(sibling)) : null}
				</Fragment>
			);
	};

	const formComponentRenderer = (input: FormSchemeInput) => {
		const { key, children, type, helperText, errorText, className, label, extra } = input;
		if (type === 'group') {
			if (!children) throw new Error('Grouped components must have children components');
			return (
				<div className={className}>
					<div>{label}</div>
					{helperText !== '' ? <FormHelperText>{helperText}</FormHelperText> : null}
					{errorText !== '' ? <FormHelperText error={true}>{errorText}</FormHelperText> : null}
					{extra.treeView ? (
						<TreeView
							key={key}
							defaultCollapseIcon={<ExpandMoreIcon />}
							defaultExpandIcon={<ChevronRightIcon />}
							defaultExpanded={[ extra.collapse ? '0' : '1' ]}
						>
							<TreeItem nodeId="1" label={label}>
								<FormGroup row={false}>{children.map((child) => renderFormComponent(child))}</FormGroup>
							</TreeItem>
						</TreeView>
					) : (
						<FormGroup row={true} key={key}>
							{children.map((child) => renderFormComponent(child))}
						</FormGroup>
					)}
				</div>
			);
		} else return renderFormComponent(input);
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
		disabled
	} = props;

	return (
		<form className={`${classNames ? ' ' + classNames : ''} form`} onSubmit={handleSubmit}>
			<div className={`form-content`}>
				{inputs.map((input) => formComponentRenderer(input))}
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
						{resetMsg ? resetMsg : 'Reset'}
					</Button>
					<Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isValid || disabled}>
						{submitMsg ? submitMsg : 'Submit'}
					</Button>
				</FormGroup>
			) : null}
		</form>
	);
}

export default Form;
