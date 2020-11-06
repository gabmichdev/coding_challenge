import { HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';

export interface IGeneralResponse {
    success: boolean;
    response: IResponseObject;
}

export interface IResponseObject {
    message?: string;
    httpCode: number;
    [propName: string]: any;
}

export class GenericError extends HttpError {
    errors: ValidationError[];
}
