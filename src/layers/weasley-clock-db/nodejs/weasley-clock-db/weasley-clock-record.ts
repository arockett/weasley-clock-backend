import { DynamoDbTable } from '@aws/dynamodb-data-mapper';
import {
  attribute,
  hashKey,
  rangeKey
} from '@aws/dynamodb-data-mapper-annotations';


const TABLE_NAME = process.env.WEASLEY_CLOCK_DB_TABLE_NAME;

export class WeasleyClockRecord {

  get [DynamoDbTable]() {
    return TABLE_NAME;
  }

  @hashKey()
  hashKey: string;

  @rangeKey()
  rangeKey: string;

  @attribute({defaultProvider: () => new Date()})
  createdAt: Date;
}