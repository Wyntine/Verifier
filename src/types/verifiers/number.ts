export interface NumberVerifierData {
  expectedNumber?: number;
  minValue?: number;
  maxValue?: number;
  //! Delayed to future update because of instability of the check.
  // maxLength?: number;
  // minLength?: number;
  // length?: number;
  positive?: boolean;
  negative?: boolean;
  zero?: boolean;
  integer?: boolean;
  safeInteger?: boolean;
  allowedRanges?: NumberRange[];
  excludedRanges?: NumberRange[];
  dividableBy?: number[];
}

export interface NumberRange {
  start: NumberRangeItem;
  end: NumberRangeItem;
}

export interface NumberRangeItem {
  number: number;
  included: boolean;
}

export interface AllowedSigns {
  positive?: boolean;
  zero?: boolean;
  negative?: boolean;
}
