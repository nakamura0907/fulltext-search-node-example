import mysql from "mysql2/promise";
import { WriteModel } from "../index";

export class MySQLClient {
    async addPost(model: WriteModel) {
        this.useTransaction((connection) => {
            connection.execute("INSERT INTO posts VALUES (?, ?, ?);", [model.id, model.caption, this.toMySQLDateFormat(model.createdAt)])
        })
    }

    async addPosts(model: WriteModel[]) {
        const sql = "INSERT INTO posts VALUES (?, ?, ?);"

        this.useTransaction((connection) => {
            model.forEach(async (value) => {
                await connection.execute(sql, [value.id, value.caption, this.toMySQLDateFormat(value.createdAt)])
            })
        })
    }

    async searchPosts(query: string) {
        return this.usePool(async (connection) => {
            return await connection.query("SELECT * FROM posts WHERE MATCH (caption) AGAINST (? IN NATURAL LANGUAGE MODE);", query)
        })
    }

    async truncatePosts() {
        this.usePool(async (connection) => {
            await connection.execute("TRUNCATE TABLE posts;");
        })
    }

    private async usePool<T>(callback: (connection: mysql.PoolConnection) => T) {
        let pool: mysql.Pool | undefined;
        let connection: mysql.PoolConnection | undefined;
        try {
            pool = this.createPool();
            connection = await pool.getConnection();

            return await callback(connection);
        } catch (error) {
            throw error;
        } finally {
            connection?.release();
            pool?.end();
        }
    }

    private async useTransaction<T>(callback: (connection: mysql.PoolConnection) => T) {
        return this.usePool(async (connection) => {
            try {
                await connection.beginTransaction();
                const result = await callback(connection);
                await connection.commit();
                return result;
            } catch (error) {
                await connection.rollback();
                throw error;
            }
        });
    }

    private createPool() {
        return mysql.createPool({
            host: process.env.MYSQL_HOST || "localhost",
            user: process.env.MYSQL_USER || "user",
            password: process.env.MYSQL_PASSWORD || "password",
            database: process.env.MYSQL_DATABASE || "my_database",
        });
    }            

    private toMySQLDateFormat(dateStr: string) {
        return new Date(dateStr);
    }
}