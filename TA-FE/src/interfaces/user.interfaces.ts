export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPasswd: string;
}

export interface ILogin {
  email: string;
  password: string;
}
