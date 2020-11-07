import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { GenericError, IResponseObject } from '../interfaces/responses';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
	error(error: GenericError, _: Request, res: Response, _1: NextFunction) {
		try {
			let errors: ValidationError[] | null = null;
			if (error.errors) {
				errors = error.errors;
			}
			const response: IResponseObject = {
				message: error.message,
				httpCode: error.httpCode,
				errors
			};
			return res.status(error.httpCode).json(response);
		} catch (err) {
			const response: IResponseObject = {
				message: 'An unexpected error ocurred',
				httpCode: 500
			};
			return res.status(response.httpCode).json(response);
		}
	}
}
