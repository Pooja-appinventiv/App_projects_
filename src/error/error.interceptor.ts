import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof HttpException) {
          // Handle known HTTP exceptions (e.g., BadRequestException, NotFoundException, etc.)
          return throwError(error)}
          else {
          // Handle other unexpected errors
          return throwError(new HttpException('Internal Server Error', 500));
        }
      }),
    );
  }
}
