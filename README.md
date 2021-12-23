# Repositories templates

## Example:

 ```
 import { AbstractCachedRepository } from '@khalitovadel/abstract-repository';
 
export class MyEntity {
    private readonly id!: string;
    private readonly fullName: string;
    private otherField?: string;
    private userId: string;

    constructor(fullName: string) {
        this.fullName = fullName;
    }
}

export interface ObjectFromDb {
    _id: string;
    fullName: string;
    userId: string;
}

export class MyEntityRepository extends AbstractCachedRepository<string, ObjectFromDb, MyEntity, MyEntity> {
    protected decrypt(value: ObjectFromDb): MyEntity {

        const instance = Object.create(Object.getPrototypeOf(MyEntity));
        Object.assign(instance, {
            id: String(value._id),
            fullName: value.fullName,
            otherField: '',
            userId: value.userId,
        })
        return instance;
    }

    protected create(value: MyEntity): Promise<[string, ObjectFromDb]> {
        // your implementation
    }

    protected update(value: MyEntity): Promise<[string, ObjectFromDb]> {
        // your implementation
    }

    protected findByIds(ids: string[]): Promise<Map<string, ObjectFromDb>> {
        // your implementation
    }

    /**
     * New Method of repository
     * Here I call my db, to find entity by index
     * Mongodb example:
     * const result: {userId: string, _id: string}[] = model.find({ userId }, {_id: 1, userId: 1});
     * Our base goal find that data only by index
     * To prevent the database from trying to read file documents
     * then:
     * return this.list(result.map(el => el._id));
     * 
     * As result we have very fast methods,
     * who get all data from cache, in the correct sequence (If there are necessary sortings)
     * if not exists repository set it to cache
     */
    public findEntityByRelatedUser(userId: string) {
        // your implementation
    }
}
 ```