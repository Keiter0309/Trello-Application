import { IUser } from "./user.interfaces";

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  setSelectedUser: (user: IUser | null) => void;
}
