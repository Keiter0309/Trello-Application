export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}
