import { create } from "zustand";
import { AuthState } from "../interfaces/authState.interfaces";
import { axiosInstance } from "../lib/axios";
import { EAuth } from "../enums/auth.enums";
import { ILogin, IRegister } from "../interfaces/user.interfaces";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create<AuthState>((set, get) => ({
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
      set({ authUser: response.data.data });
      get().connectSocket();
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
      get().connectSocket();
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
      set({ authUser: response.data });
      get().connectSocket();
      toast.success("Logged in successfully");
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
      get().disconnectSocket();
    } catch (error) {
      console.error(`Error in logout`, error);
      toast.error("Error logging out");
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser) return;

    const socket = io("http://localhost:9000", {
      query: {
        userId: authUser._id,
      },
    });
    console.log(`auth user:::: ${authUser._id}`);
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      console.log({ userIds });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && socket.connected) socket.disconnect();
  },
}));
