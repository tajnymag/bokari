import { TransformFnParams } from 'class-transformer';

export function ToLowercaseAndTrim(params: TransformFnParams) {
	if (params.value) return params.value.toLowerCase().trim();
}
