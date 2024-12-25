import { create } from "zustand";
import { AuthState } from "../interfaces/authState.interfaces";
import { axiosInstance } from "../lib/axios";
import { EAuth } from "../enums/auth.enums";
import { ILogin, IRegister } from "../interfaces/user.interfaces";
import toast from "react-hot-toast";

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  onlineUsers: null,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get(EAuth.CHECK_AUTH);
      set({ authUser: response.data });
    } catch (error) {
      console.error(`Error in check Auth`, error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: IRegister) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post(EAuth.REGISTER, data);
      set({ authUser: response.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      console.error(`Error in Sign up`, error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: ILogin) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post(EAuth.LOGIN, data);
      console.log(response.data);
      toast.success("Logged in successfully");
      set({ authUser: response.data });
    } catch (error: any) {
      console.error(`Error in login`, error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(EAuth.LOGOUT);
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(`Error in logout`, error);
      toast.error("Error logging out");
    }
  },
}));
