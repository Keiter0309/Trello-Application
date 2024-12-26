import { Socket } from "socket.io-client";

export interface AuthState {
  authUser: any;
  isCheckingAuth: Boolean;
  isSigningUp: Boolean;
  isLoggingIn: Boolean;
  isUpdatingProfile: Boolean;
  socket: Socket | null;
  login: (formData: { email: string; password: string }) => Promise<void>;
  signup: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPasswd: string;
  }) => Promise<void>;
  onlineUsers: any;

  checkAuth: () => void;
  logout: () => void;
  connectSocket: () => void;

  disconnectSocket: () => void;
}
