export enum KafkaTopic {
  UESR_SIGNUP = 'user-signup',
  UESR_UPDATED = 'user-updated',
  USER_DELETED = 'user-deleted',

  POST_CREATED = 'post-created',
  POST_UPDATED = 'post-updated',
  POST_DELETED = 'post-deleted',
}

export class KafkaEvent {
  constructor(
    public readonly topic: KafkaTopic,
    public readonly data: { [prop: string]: { id: number } },
  ) {}
}
