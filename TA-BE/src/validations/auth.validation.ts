import { LoginDto, RegisterDTO } from "../interfaces/auth.interface";

export const validateRegister = (data: RegisterDTO) => {
  const errors: any = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateLogin = (data: LoginDto) => {
  const errors: any = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  }


  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};