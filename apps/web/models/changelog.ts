import { auth } from '@/lib/nextAuthOptions'
import { ChangeDiff, IChangeHistory, IHistoryOperation } from '@/types/changelog'
import mongoose, { Schema, Document, model, models, Model } from 'mongoose'

const HistorySchema = new Schema<IChangeHistory>({
  collection_name: { type: String, required: true },
  entity_id: { type: Schema.Types.ObjectId, required: true, default: null },
  operation: { type: String, enum: IHistoryOperation, required: true },
  changed_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  changed_by_label: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  diff: { type: Schema.Types.Mixed },
}, {
    collection: 'changelog',
    timestamps : true,
    toJSON: {
        virtuals: true
    }
})

const collectionExceptions:any = {
  "users" : [ 'updatedAt','createdAt','timestamp','department_label','spouse', 'edit','type']
}

function changelogPlugin(schema: Schema<any>, next: Function) {

  schema.post('save', async function (doc: Document & {_change_by: string, _change_by_label: string}) {
    if(doc.isNew) {
      const history = await Changelog.create({
        collection_name: schema.get('collection'),
        entity_id: doc._id,
        operation: IHistoryOperation.CREATE,
        changed_by: doc._change_by,
        changed_by_label: doc._change_by_label,
        description: `Created ${schema.get('collection')} with ID ${doc._id}`,
        summary: `Created ${schema.get('collection')} with ID ${doc._id} by ${doc._change_by_label}`,
        diff: doc,
      })
    }
  })

  schema.pre('findOneAndUpdate', async function () {
    const collectionName = this.model.collection.name
    let org:any = await this.model.findOne(this.getQuery()).lean(false)

    let item:any = this
    let description = ""
    const user = await auth()
    item._original = org
    if(org && user){
        item._change_by = user?.user_id
        item._change_by_label = user?.first_name + " " + user?.last_name

        const original:any = org.toJSON()
        const updatedSet:any = this.getUpdate()
        const updated:any = updatedSet?.$set || updatedSet
        const diff: ChangeDiff = {}

        for(const key of Object.keys(updated)) {
          if(
            typeof original[key] !== undefined &&
            typeof updated[key] !== undefined &&
            !areEqual(original[key], updated[key]) &&
            updated[key] !== undefined &&
            collectionExceptions[collectionName]?.includes(key) === false
          ) {
              diff[key] = { from: original[key], to: updated[key] }
          }
        }

        if(updated?.deleted) {
          description = `Soft Deleted ${collectionName} with ID ${updated._id} by ${item._change_by_label}`
        }

        await Changelog.create({
          collection_name: collectionName,
          entity_id: original._id,
          operation: IHistoryOperation.UPDATE,
          changed_by: item._change_by,
          changed_by_label: item._change_by_label,
          description: updated?.deleted ?  description : `Updated ${collectionName} with ID ${updated._id}`,
          summary: updated?.deleted ?  description : `Updated ${collectionName} with ID ${updated._id} by ${item._change_by_label}`,
          diff: diff,
        })
      }
  })

  schema.pre("findOneAndDelete", async function (next) {
    const collectionName = this.model.collection.name
    let org:any = await this.model.findOne(this.getQuery())
    let item:any = this
    await Changelog.create({
      collection_name: collectionName,
      entity_id: org._id,
      operation: IHistoryOperation.DELETE,
      changed_by: item._change_by,
      changed_by_label: item._change_by_label,
      description: `Deleted ${collectionName} with ID ${org._id}`,
      summary: `Deleted ${collectionName} with ID ${org._id} by ${item._change_by_label}`,
    })
    next()
  })
}

function areEqual(a: any, b: any): boolean {
  if (a instanceof mongoose.Types.ObjectId && b instanceof mongoose.Types.ObjectId) {
    return a.toString() === b.toString()
  }
 
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (a?.toString() ==  b?.toString()) {
    return true
  }

  if (a?.toString() ==  b?.toString()) {
    return true
  }
  return a === b
}



const Changelog:Model<IChangeHistory> = models.Changelog || model<IChangeHistory>('Changelog', HistorySchema)

export { Changelog, changelogPlugin }
