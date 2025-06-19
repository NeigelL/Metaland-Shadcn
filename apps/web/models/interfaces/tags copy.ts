export enum ETagActions {
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete",
    LINKED_TAGS = "linked-tags",
    UNLINKED_TAGS = "unlinked-tags"
}
export interface ITag {
    name: String,
    description?: String,
    color?: String,
    created_by: String,
    updated_by: String,
    company_id: String,
    active: boolean,
    deleted: boolean,
}