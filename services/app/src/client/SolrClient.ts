import { WriteModel } from "../index";

export class SolrClient {
    private readonly baseUrl;

    constructor() {
        const url = process.env.SOLR_URL || "http://localhost:8983";
        this.baseUrl = `${url}/solr/posts`;
    }

    // ドキュメントを追加する
    async addPost(post: WriteModel) {
        const url = `${this.baseUrl}/update/json/docs?commit=true`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(post)
        };

        await fetch(url, options);
    }

    // 複数ドキュメントを追加する
    async addPosts(posts: WriteModel[]) {
        const url = `${this.baseUrl}/update/json/docs?commit=true`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(posts)
        };

        await fetch(url, options);
    }

    // ドキュメントを検索する
    async searchPosts(query: string) {
        const url = `${this.baseUrl}/select?q=caption:${query}`;

        const response = await fetch(url);
        return await response.json();
    }

    // ドキュメントを空にする
    async truncatePosts() {
        const url = `${this.baseUrl}/update?commit=true`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ delete: { query: "*:*" } })
        };

        await fetch(url, options);
    }
}