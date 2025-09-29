export interface User {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  profileImage?: string;
}

export interface chat {
  id: number;
  message: string;
  from: User;
  to: User;
  createdAt: string;
  updatedAt: string;
  status: "SENT" | "DELIVERED" | "READ";
}

export interface WsRequest {
  type: string;
  fromUserId?: number;
  toUserId?: number;
  message?: string;
}

export interface WSResponse{
    
}
