# marlin

✅ Return 200 OK for successful GET requests.
✅ Use 201 Created when creating new resources.
✅ Return 400 Bad Request if input validation fails.
✅ Use 401 Unauthorized for missing authentication.
✅ Log and monitor 5xx errors to fix server issues.

<!-- ​ Error Handling:
○​ Handling errors and retries with exponential backoff.
○​ Managing idempotency in API retries.    ------------->>>>  need yo be handle later

3.​ Exponential Backoff Techniques:
○​ Gradual increase in retry delays (e.g., 1s, 2s, -->

B-Tree Indexes:

- Use when you need range queries (>, <, BETWEEN, ORDER BY)
- Good for high-cardinality columns (many unique values)
- Excellent for prefix searches (LIKE 'abc%')
- Optimal for primary keys and foreign keys
- Works well for multi-column indexes

Hash Indexes:

- Best for exact equality comparisons (= or IN)
- Extremely fast point lookups when key is known
- Ideal for join operations on exact matches
- Good for low-cardinality columns with frequent queries
- Often used in memory tables or NoSQL databases

Decision factors:

1. If you need range operations or sorting, choose B-Tree
2. If you only need exact lookups and maximum speed, choose Hash
3. Most RDBMS use B-Tree by default because of its versatility
4. Hash indexes use less memory for storage but don't maintain order
5. B-Trees work better with partial key lookups

Many modern databases (like PostgreSQL) will choose the appropriate access method based on your query patterns, even if you've created both index types.

command for run docker image with port
docker run -p <local-port>:<container-port> <image-name>
