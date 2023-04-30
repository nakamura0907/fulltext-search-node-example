import * as yargs from 'yargs';
import { ElasticClient, MySQLClient, SolrClient } from './client';

(async () => {
    const argv = await yargs
    .option(
        'query',
        {
            alias: 'q',
            describe: '検索クエリ',
            type: 'string',
            demandOption: true
        }
    )
    .help().argv;
    const { query } = argv;

    // データストアからデータを取得
    const elasticClient = new ElasticClient();
    const solrClient = new SolrClient();
    const mysqlClient = new MySQLClient();

    console.log("検索中")
    const [elasticResult, solrResult, [mysqlResult]] = await Promise.all([
        elasticClient.searchPosts(query),
        solrClient.searchPosts(query),
        mysqlClient.searchPosts(query)
    ]);

    console.log("*** Elasticsearch ***")
    console.log(elasticResult.hits.hits, "\n")

    console.log("*** Apache Solr ***")
    console.log(solrResult, "\n")

    console.log("*** MySQL ***");
    console.log(mysqlResult, "\n");
})();
