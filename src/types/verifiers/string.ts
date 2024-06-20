export interface StringVerifierData {
  length?: number;
  maxLength?: number;
  minLength?: number;
  regex?: RegExp;
  expectedString?: string;
}
