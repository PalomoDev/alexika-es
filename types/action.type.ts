export interface ActionResponse<T = undefined> {
    success: boolean;
    data?: T;
    message?: string;
}

