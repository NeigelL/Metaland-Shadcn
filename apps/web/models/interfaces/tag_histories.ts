
export enum ITagHistoryAction {
    ADDED = "added",
    REMOVED = "removed"
}
export interface ITagHistoryEntry {
    action: ITagHistoryAction,
    tag: String,
    timestamp: Date,
    created_by: String,
}


export interface IDescriptionHistoryEntry {
    description: String,
    timestamp: Date,
    created_by: String,
}
