export interface ErrorPayload {
  message: string;
  code: string;
}

export interface Response<T> {
  trackingId: string;
  status: string;
  payload: T | ErrorPayload;
}
