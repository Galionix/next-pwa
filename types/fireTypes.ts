export interface Itask {
    id: string;
    data: {

        description: string;
        archived: boolean;
        // checked: boolean;
        checkable: boolean;
        text: string;
        timestamp: any;
        urgency: "normal" | "warning" | "urgent"
    }

}