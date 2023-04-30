import { Client } from "@elastic/elasticsearch";
import { WriteModel } from "../index";

export class ElasticClient {
    private readonly INDEX_NAME = 'posts';
    private readonly client: Client;

    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        })
    }

    // ドキュメントを追加する
    async addPost(model: WriteModel) {
        if (!this.isExists()) this.createIndex();

        await this.client.index({
            index: this.INDEX_NAME,
            document: {
                id: model.id,
                caption: model.caption,
                createdAt: model.createdAt
            }
        });
    }

    // 複数ドキュメントを追加する
    async addPosts(models: WriteModel[]) {
        if (!this.isExists()) this.createIndex();

        await this.client.bulk({
            operations: models.flatMap(doc => [{
                index: {
                    _index: this.INDEX_NAME
                }
            }, doc])
        })
    }

    // ドキュメントを検索する
    async searchPosts(query: string) {
        return this.client.search({
            index: this.INDEX_NAME,
            body: {
                query: {
                    match: {
                        caption: query
                    }
                },
            },
        })
    }

    // インデックスを削除する
    async removeIndex() {
        await this.client.indices.delete({
            index: this.INDEX_NAME,
            ignore_unavailable: true
        })
    }

    private async createIndex() {
        await this.client.indices.create({
            index: this.INDEX_NAME,
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    caption: { type: 'text' },
                    createdAt: { type: 'date' }
                }
            }
        })
    }

    private async isExists() {
        return await this.client.indices.exists({
            index: this.INDEX_NAME
        })
    }
}