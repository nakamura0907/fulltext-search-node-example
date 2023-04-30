CREATE TABLE posts (
    id CHAR(36) NOT NULL,
    caption TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FULLTEXT KEY `FT_CAPTION` (`caption`) WITH PARSER ngram
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;