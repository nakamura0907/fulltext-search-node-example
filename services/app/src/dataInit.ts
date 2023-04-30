import { WriteModel } from "./index";
import { v4 as uuidv4 } from "uuid";
import { CreatedAt } from "./util/date";
import { ElasticClient, MySQLClient, SolrClient } from "./client";

(async () => {
    const captions = [
        "今日は何もないすばらしい一日でした",
        "隣の客はよく柿食う客だ",
        "ふとんが吹っ飛んだ",
        "HTML/CSSは楽しい",
        "これはテスト投稿です。キャプションはありません",
        "今日はテストがあります"
    ];
    const createdAt = new CreatedAt().value;
    const mock: WriteModel[] = captions.map((caption) => {
        return {
            id: uuidv4(),
            caption,
            createdAt
        }
    });

    const elasticClient = new ElasticClient();
    const solrClient = new SolrClient();
    const mysqlClient = new MySQLClient();

    // データ全削除
    console.log("削除中");
    await Promise.all([
        elasticClient.removeIndex(),
        solrClient.truncatePosts(),
        mysqlClient.truncatePosts(),
    ])
    
    // データ追加
    console.log("データ追加中");
    await Promise.all([
        elasticClient.addPosts(mock),
        solrClient.addPosts(mock),
        mysqlClient.addPosts(mock),
    ])
})()