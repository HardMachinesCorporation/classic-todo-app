import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {IApiResponse} from "@todos/shared";
import {map, Observable} from "rxjs";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IApiResponse<T>>{
        return next.handle().pipe(
            map(
                (data) => ({
                    success:true,
                    data,
                    message: ' 🔥 Successful operation'
                })
            )
        )
    }
}
