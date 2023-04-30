import * as yargs from 'yargs';
import { v4 as uuidv4 } from 'uuid';
import { WriteModel } from './index';
import { CreatedAt } from './util/date';
import { ElasticClient, MySQLClient, SolrClient } from './client';

(async () => {
    const argv = await yargs
    .option(
        'caption',
        {
            alias: 'c',
            describe: 'キャプション',
            type: 'string',
            demandOption: false,
            default: 'テスト投稿です'
        }
    )
    .help().argv;
    
    // バリデーション
    // 今回は省略
    const model: WriteModel = {
        id: uuidv4(),
        caption: argv.caption,
        createdAt: new CreatedAt().value
    }

    // データストアに追加
    const elasticClient = new ElasticClient();
    const solrClient = new SolrClient();
    const mysqlClient = new MySQLClient();

    console.log("データ追加中");
    await Promise.all([
        elasticClient.addPost(model),
        solrClient.addPost(model),
        mysqlClient.addPost(model)
    ])
})();