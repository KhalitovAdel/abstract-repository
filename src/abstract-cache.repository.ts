export abstract class AbstractCachedRepository<ID, POJO extends object, DECRYPTED_POJO extends object, MUTATE_ARGUMENT extends POJO | DECRYPTED_POJO = DECRYPTED_POJO> {
    constructor(private readonly cacheService: AbstractCachedRepository.CacheService<ID, POJO>) { }

    protected abstract decrypt(value: POJO): DECRYPTED_POJO;

    protected abstract findByIds(ids: ID[]): Promise<Map<ID, POJO>>;

    protected abstract create(value: MUTATE_ARGUMENT): Promise<[ID, POJO]>;

    protected abstract update(value: MUTATE_ARGUMENT): Promise<[ID, POJO]>;

    public async list(ids: ID[]): Promise<DECRYPTED_POJO[]> {
        const rawResult = await this.cacheService.getByIds(ids);
        const toFind = ids.filter(el => !rawResult.has(el));

        if (toFind.length) {
            const fromDb = await this.findByIds(toFind);
            fromDb.forEach((pojo, id) => {
                rawResult.set(id, pojo);
            })

            if ([...fromDb].length) await this.cacheService.setToCatchMany(fromDb);
        }


        return ids.map(id => {
            const pojo = rawResult.get(id);
            if (!pojo) return;

            return this.decrypt(pojo);
        }).filter((entity): entity is DECRYPTED_POJO => !!entity);
    }

    public async findById(id: ID): Promise<DECRYPTED_POJO> {
        const result = await this.list([id]).then(data => data.shift());

        if (!result) throw new Error(`Cannot find entity with id = ${id}`);

        return result;
    }

    public async createOne(value: MUTATE_ARGUMENT): Promise<DECRYPTED_POJO> {
        const [id, pojo] = await this.create(value);
        await this.cacheService.setToCatch(id, pojo);

        return this.decrypt(pojo);
    }

    public async updateOne(value: MUTATE_ARGUMENT): Promise<DECRYPTED_POJO> {
        const [id, pojo] = await this.update(value);
        await this.cacheService.clearCacheById(id);
        await this.cacheService.setToCatch(id, pojo);

        return this.decrypt(pojo);
    }
}

export namespace AbstractCachedRepository {
    export interface CacheService<T, POJO extends object> {
        getByIds(ids: T[]): Promise<Map<T, POJO>>;

        clearCacheById(id: T): Promise<void>;

        setToCatchMany(value: Map<T, POJO>): Promise<void>;
        setToCatch(id: T, value: POJO): Promise<void>;
    }
}