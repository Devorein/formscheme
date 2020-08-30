import * as Yup from "yup";

import { FormSchemeInputsPartial } from './types';

export default function generateYupSchema(inputs: FormSchemeInputsPartial) {
  console.log(inputs[0]);
  return Yup.object({
    name: Yup.string()
  })
}