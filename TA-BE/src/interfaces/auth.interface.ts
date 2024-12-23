export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPasswd: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPasswd: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  updatedBy: string;
  deletedBy: string;

  resetPasswordToken?: string;
  resetTokenExpired?: string;
}
