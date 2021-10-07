// Time year month day hour minute second format :2021-12-12 20:20:20
export const dateStringReg =
  /(((\d{4})-(0[13578]|1[02])-(0[1-9]|[12]\d|3[01]))|((\d{4})-(0[469]|11)-(0[1-9]|[12]\d|30))|((\d{4})-(02)-(0[1-9]|1\d|2[0-8]))|((\d{2}(0[48]|[2468][048]|[13579][26]))-(02)-(29))|(((0[48]|[2468][048]|[13579][26])00)-(02)-(29))) (([01]\d|2[0-3]):([0-5]\d):([0-5]\d))/;
// The minimum amount is 100 yuan
// export const minMoneyReg = /^[1-9]\d{2}(\.\d{2,2})?$/;
export const minMoneyReg = /^[1-9](\d+)?(\.\d{2,2})?$/;
// username
export const usernameReg = /^[a-zA-Z.0-9]{4,20}$/;
