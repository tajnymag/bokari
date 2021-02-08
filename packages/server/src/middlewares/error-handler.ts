import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: any, req: Request, res: Response, next: NextFunction) {
		if (
			Array.isArray(err.errors) &&
			err.errors.every((valError: unknown) => valError instanceof ValidationError)
		) {
			return res.status(err.httpCode).json({
				message: err.message,
				errors: err.errors
			});
		}

		if (err instanceof HttpError) {
			return res.status(err.httpCode).json({
				message: err.message
			});
		}

		if (err instanceof Error) {
			console.error(
				`Encountered an interval server error on ${req.method} ${req.path}:`,
				err
			);
			return res.status(500).json({
				message: 'Internal Server Error'
			});
		}
	}
}
