import { Action, Interceptor } from 'routing-controllers';
import { isPlainObject } from 'lodash-es';
import { classToPlain } from 'class-transformer';

function isPrimitive(value: unknown) {
	return (typeof value !== 'object' && typeof value !== 'function') || value === null;
}

@Interceptor()
export class ResponseTransformer {
	intercept(action: Action, content: unknown) {
		if (isPrimitive(content) || isPlainObject(content)) {
			return content;
		}

		console.log(JSON.stringify(content) + " seems to be a class");
		return classToPlain(content);
	}
}
