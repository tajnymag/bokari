import { HttpError, HttpProblem, isHttpError, isHttpProblem } from '@curveball/http-errors';
import { ValidationError } from "class-validator";
import {ExpressErrorMiddlewareInterface, Middleware} from "routing-controllers";

@Middleware({type: "after"})
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: any, req: any, res: any, next: (err: any) => any) {
		if (Array.isArray(err) && err.every(valError => valError instanceof ValidationError)) {
			const firstValError = err[0];

			console.warn(`Caught Validation Error for ${req.method} ${req.path}:`, firstValError.property);
			return res.status(422).json({
				message: 'Validation Failed',
				details: `Value ${JSON.stringify(firstValError.value)} does not satisfy necessary constraints!`
			});
		}

		if (isHttpProblem(<Error>err)) {
			const httpProblem = err as HttpProblem;
			return res.status(httpProblem.httpStatus).json({
				message: httpProblem.message
			});
		}

		if (isHttpError(<Error>err)) {
			const httpError = err as HttpError;
			return res.status(httpError.httpStatus).json({
				message: httpError.message
			});
		}

		if (err instanceof Error) {
			console.error(`Encountered an interval server error on ${req.method} ${req.path}:`, err);
			return res.status(500).json({
				message: 'Internal Server Error'
			});
		}
	}
}
