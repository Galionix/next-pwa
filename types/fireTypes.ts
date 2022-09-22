

export interface Itask {
  id: string;
  data: {

    description: string;
    archived: boolean;
    // checked: boolean;
    checkable: boolean;
    text: string;
    images: {
      filename: string;
      variants: string[];
    }[];
    timestamp: any;
    urgency: 'normal' | 'warning' | 'urgent';
    createdAt: { seconds: number; nanoseconds: number };
    updatedAt: { seconds: number; nanoseconds: number };
    archivedAt: { seconds: number; nanoseconds: number };
  };
}

export interface ITaskGroup {
  id: string;
  data: {
    title: string;
    timestamp: Date;
    tasks: Itask[]
  }
}
export interface IPendingShareInvite{
  id?: string;
  fromUser: string;
  toUserId?: string;
  pendingId?: string;

    taskGroup: string;
  sendAt?: {
    seconds: number;
    nanoseconds: number;
    };
    acceptedAt?: {
      seconds: number;
      nanoseconds: number;
      };
    declinedAt?: {
      seconds: number;
      nanoseconds: number;
      };
  // }
}
export interface IUser {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  data?: {
    theme: string;
  }
  picture?: string; //basically the same as imageUrl

  taskGroups?: ITaskGroup[]

  pendingShareInvites?: IPendingShareInvite[]
    // createdAt: { seconds: number; nanoseconds: number };
    updatedAt?: Date;
  // };
}
