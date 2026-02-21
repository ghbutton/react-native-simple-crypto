export type TestStatus = 'idle' | 'running' | 'pass' | 'fail';

export interface TestResult {
  name: string;
  status: TestStatus;
  detail: string;
}
