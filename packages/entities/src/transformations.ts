import { TransformFnParams } from 'class-transformer';

export function ToLowercaseAndTrim(params: TransformFnParams) {
	if (params.value) return params.value.toLowerCase().trim();
}

export function ParseFloat(params: TransformFnParams) {
	if (params.value)
		return parseFloat(params.value.toString().replace(/\s/g, '').replace(/,/g, '.'));
}
