/** Background management account identity enumeration type */
export enum AdminIdentityEnum {
  /** Ordinary account */
  NORMAL = 0,
  /** Super administrator */
  SUPPER = 1,
}

/** Background management account identity description */
export const AdminIdentityMessage = {
  0: 'Ordinary account',
  1: 'Super administrator',
};
