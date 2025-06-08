

enum IHistoryOperation {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete'
}

interface IChangeHistory {
  collection_name: string;
  entity_id: String;
  operation: IHistoryOperation;
  changed_by: String;
  changed_by_label: string;
  description: string;
  summary: string;
  timestamp: Date;
  diff?: Record<string, any>;
  changelog?: ChangeDiff;
}

interface ChangeDiff {
    [key: string]: { from: any; to: any };
}

export {
    IHistoryOperation,
    type IChangeHistory,
    type ChangeDiff
}