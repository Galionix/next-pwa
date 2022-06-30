export interface Itask {
  id: string;
  data: {
    description: string;
    archived: boolean;
    // checked: boolean;
    checkable: boolean;
    text: string;
    timestamp: any;
    urgency: 'normal' | 'warning' | 'urgent';
    createdAt: { seconds: number; nanoseconds: number };
    updatedAt: { seconds: number; nanoseconds: number };
    archivedAt: { seconds: number; nanoseconds: number };
  };
}
