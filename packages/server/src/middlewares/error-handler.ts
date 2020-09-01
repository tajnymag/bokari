import { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

export function errorHandler(
	err: unknown,
	req: ExRequest,
	res: ExResponse,
	next: NextFunction
): ExResponse | void {
	if (err instanceof ValidateError) {
		console.warn(`Caught Validation Error for ${req.method} ${req.path}:`, err.fields);
		return res.status(422).json({
			message: 'Validation Failed',
			details: err?.fields
		});
	}

	if (err instanceof Error) {
		console.error(`Encountered an interval server error on ${req.method} ${req.path}:`, err);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}

	next();
}
