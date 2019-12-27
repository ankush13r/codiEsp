export interface FileObj {
    name: String,
    type: String,
    path: String,
    target: String,
    source?: string,
    link?: String,
    metaData?: {
        location: string,
        conationTime: number
    },
    error?: {
        message: string
    };
}

