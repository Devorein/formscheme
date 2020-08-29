import React, { Fragment } from 'react';
import { Formik } from 'formik';

import Form from './Form';
import { InputFormProps, FormSchemeInput } from './types';

function InputForm (props: InputFormProps) {
	const populateInitialValue = () => {
		const { validationSchema, inputs } = props;
		const initialValues: Record<string, any> = {};
		const initialErrors: Record<string, any> = {};

		function inner (input: FormSchemeInput, parents: FormSchemeInput[] = [], index: number) {
			const parent = parents[parents.length - 1] || {};
			const { extra } = parent;
			if (input.type === 'group') {
				if (input.children) input.children.forEach((child, index) => inner(child, [ ...parents, input ], index));
				else throw new Error('Grouped FormScheme must have childrens');
			} else {
				const { name, defaultValue } = input;
				const field_key = `${extra.append}` + (extra.useArray ? index : name);
				input.name = field_key;
				initialValues[field_key] = typeof defaultValue !== 'undefined' ? defaultValue : '';
				try {
					validationSchema.validateSyncAt(field_key, initialValues[field_key], {
						abortEarly: true
					});
				} catch (err) {
					initialErrors[field_key] = err.message;
				}
			}
		}
		inputs.forEach((input) => (input ? inner(input, [], 0) : void 0));

		return { initialValues, initialErrors };
	};
	const {
		validationSchema,
		onSubmit,
		validateOnMount = false,
		children,
		passFormAsProp = false,
		initialTouched
	} = props;

	const { initialValues, initialErrors } = populateInitialValue();

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={validationSchema}
			validateOnMount={validateOnMount}
			enableReinitialize={true}
			initialTouched={initialTouched || {}}
			initialErrors={initialErrors}
		>
			{(formik_props) => {
				const FORM = <Form {...formik_props} {...props} />;
				return (
					<Fragment>
						{passFormAsProp ? null : FORM}
						{typeof children === 'function' ? (
							children({
								...props,
								inputs: passFormAsProp ? FORM : null
							})
						) : (
							children
						)}
					</Fragment>
				);
			}}
		</Formik>
	);
}

export default InputForm;
