import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable()
export class ThrottlingInterceptor implements NestInterceptor {
  private readonly MAX_CONCURRENT_REQUESTS = 3; // Allow 3 requests at a time
  private readonly DELAY_MS = 10000; // Delay excessive requests by 1 second
  private activeRequests = 0; // Track current active requests

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.activeRequests >= this.MAX_CONCURRENT_REQUESTS) {
      return next.handle().pipe(
        delay(this.DELAY_MS), // Throttle requests by delaying execution
      );
    }

    this.activeRequests++;

    console.log(this.activeRequests); // Increase active request count

    return next.handle().pipe(
      mergeMap((response) => {
        this.activeRequests--; // Decrease count after request finishes
        return [response];
      }),
    );
  }
}
