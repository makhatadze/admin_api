/** Platform enumerated type */
export enum PlatformEnum {
  /** Ordinary personnel (without any authority) */
  NO_AUTH = 0,
  /** Operator platform */
  ADMIN_PLATFORM = 1,
  /** Check into the merchant platform */
  MERCHANT_PLATFORM = 2,
}

/** Platform text */
export const PlatformMessage = {
  0: 'Ordinary personnel',
  1: 'Operation Management Platform',
  2: 'Check into the merchant platform',
};
