import { IDescriptionHistoryEntry, ITagHistoryAction, ITagHistoryEntry } from "@/models/interfaces/tag_histories"


export async function updateBuyerProspectTags(
    model:any,
    addTags : string[],
    removeTags : string[],
    user_id: string,
    columns: {
        tag: string,
        history: string
    } = {
        tag: "status",
        history: "statusHistory"
    }
) {
    return await updateTags(model, addTags, removeTags, user_id, columns)
}

export async function updateTags(
    model:any,
    addTags : string[],
    removeTags : string[],
    user_id: string,
    columns: {
        tag: string,
        history: string
    } = {
        tag: "tags",
        history: "tagHistory"
    }
) {
    if(!model) {
        throw new Error("TagHelper Model is not defined")
    }

    const historyEntries: ITagHistoryEntry[] = []

    for(const tag of addTags) {
        if(!model[columns.tag].includes(tag)) {
            model[columns.tag].push(tag)
            historyEntries.push({
                action: ITagHistoryAction.ADDED,
                tag: tag,
                timestamp: new Date(),
                created_by: user_id
            })
        }
    }

    for(const tag of removeTags) {
        if(model[columns.tag].includes(tag)) {
            model[columns.tag] = model[columns.tag].filter((t: any) => t != tag)
            historyEntries.push({
                action: ITagHistoryAction.REMOVED,
                tag: tag,
                timestamp: new Date(),
                created_by: user_id
            })
        }
    }
    model[columns.history].push(...historyEntries)

    await model.save()

}

export async function updateDescription(
    model:any,
    description : string,
    user_id: string
) {
        if(!model) {
            throw new Error("TagHelper Model is not defined")
        }

        const historyEntries: IDescriptionHistoryEntry[] = []
        if(model.description !== description) {
            const desc = description.trim()
            model.description = desc
            historyEntries.push({
                description: description,
                timestamp: new Date(),
                created_by: user_id
            })
        model.descriptionHistory.push(...historyEntries)
        await model.save()
    }
}