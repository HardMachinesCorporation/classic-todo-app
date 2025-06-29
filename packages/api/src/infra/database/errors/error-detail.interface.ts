export interface ErrorDetail {
  details?: string;
  source: string;
  [key: string]: unknown;
}
