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

. Rate Limiting
Fixed Window vs. Sliding Window Algorithms – Explanation of both approaches and their trade-offs.
Tracking User Requests with In-Memory Structures – Using hash maps and other efficient data structures. 2. Throttling
Preventing Server Overload – Strategies to limit request rates and ensure system stability.
Rate Limiting vs. Throttling – Key differences and when to use each.
Types of Throttling:
Hard Throttling – Strict limits that immediately reject excess requests.
Soft Throttling – Graceful degradation, allowing partial processing or delayed execution.
Adaptive Throttling – Dynamically adjusting limits based on server load and traffic patterns. 3. Scalable Rate Limiting and Throttling
Distributed Rate Limiting – Using Redis, token bucket, or leaky bucket algorithms for scalability.
Ensuring High Availability – Handling synchronization and consistency in distributed environments.
Throttling at Different Levels:
Per User/IP/Application Level – Applying limits based on identity.
Global vs. Regional Throttling – Managing API limits across different data centers.

Asynchronous Task Handling and Workflow Design

1. Asynchronous Task Handling
   Benefits of Background Processing

Resource Optimization: Main application threads stay available for user interactions
Improved User Experience: Users don't wait for long-running operations to complete
Scalability: Ability to handle high volumes of tasks by distributing processing load
Fault Isolation: Failures in background tasks don't affect the main application flow

Queuing Mechanisms

RabbitMQ:

Message broker implementing Advanced Message Queuing Protocol (AMQP)
Supports publish/subscribe, routing patterns, and work queues
Great for task distribution and reliable message delivery

Apache Kafka:

Distributed event streaming platform with high throughput
Excellent for real-time data pipelines and streaming applications
Persistent storage with configurable retention periods
Suited for event sourcing architectures

2. Ensuring Resilience
   Retry Mechanisms with Exponential Backoff

Concept: Gradually increase delay between retry attempts
Implementation:
Copyretry_delay = base_delay \* (multiplier ^ attempt_number)

Benefits: Prevents system overload during outages, allows temporary issues to resolve

Ensuring Eventual Consistency

Idempotent Operations: Design operations to be safely repeatable
Stateful Processing: Track task states (pending, processing, completed, failed)
Dead Letter Queues: Capture and handle persistently failing messages
Compensating Transactions: Define recovery actions for partial successes

3. Designing APIs for Async Workflows
   Immediate Response Patterns

Request Acknowledgement: Return a 202 Accepted status with a task ID
Polling Endpoints: Provide endpoints to check task status (GET /tasks/{taskId})
Webhooks: Allow clients to register callback URLs for completion notifications
WebSockets: Establish persistent connections for real-time updates

Practice: Asynchronous Payment Processing
Workflow Design
Asynchronous Payment Processing WorkflowClick to open diagramTap to open
Implementing Retries with Exponential Backoff
Payment Processor with Exponential BackoffClick to open codeTap to open
API Design for the Asynchronous Payment System
API Design for Asynchronous PaymentsClick to open codeTap to open
Key Implementation Considerations

Task State Management:

Persist task states in a database to survive service restarts
Include timestamps for monitoring SLAs and timing out stale tasks

Error Handling Strategy:

Distinguish between retriable errors (network issues) and permanent failures (invalid card)
Implement circuit breakers to prevent cascading failures

Monitoring and Observability:

Track queue depths and processing times
Set up alerting for failed tasks and retry exhaustion
Implement distributed tracing across services

Security Considerations:

Encrypt sensitive payment data
Implement authentication between services
Apply rate limiting to prevent abuse

Why Use Background Processing for Slow Operations?
Some operations, like payment processing, email notifications, or data processing, take time and shouldn’t block the main request. Instead of making the user wait, we can:
✅ Offload heavy tasks to a background worker.
✅ Improve responsiveness by returning a quick acknowledgment.
✅ Increase reliability by retrying failed tasks.

Queueing Mechanisms for Delayed Tasks
For handling async tasks, we can use message queues like:

RabbitMQ (good for complex workflows, reliable message delivery).
Kafka (event streaming, high throughput).
BullMQ (built on Redis, great for simple job processing in Node.js).
For NestJS, BullMQ (Redis-based) is a popular choice. Let’s use that!

2️⃣ Ensuring Resilience
Retry Failed Tasks Using Exponential Backoff
If a task (e.g., payment processing) fails due to network issues, we should retry instead of failing immediately.

Exponential backoff: Wait times increase exponentially between retries (e.g., 1s → 2s → 4s → 8s).
This prevents overwhelming the system with retries.
Ensuring Eventual Consistency
Use idempotent operations (retrying the same request won’t create duplicate actions).
Track state changes in a database (e.g., task status = PENDING, PROCESSING, FAILED, COMPLETED).
3️⃣ Designing APIs for Async Workflows
We want an API that:

Accepts a payment request and immediately returns a response (202 Accepted).
Offloads the actual payment processing to a background worker.
Allows the client to check the status of the payment later.

Optimizing API Response Time

In-Memory Caching (Redis)

Stores frequently accessed data in Redis to avoid unnecessary DB queries.
Great for user sessions, rate limiting, and frequently accessed data.
Database Query Caching

TypeORM Cache: Caches DB query results to speed up responses.
Useful for repeated queries that rarely change.
✅ Reducing Payload Size
Pagination

Instead of returning thousands of records, return small chunks using LIMIT & OFFSET.
Example: GET /users?page=1&limit=10
Selective Data Retrieval

Use GraphQL or DTOs (Data Transfer Objects) to return only the necessary fields instead of full entities.
🔹 2️⃣ Efficient Code Design
✅ Lazy Loading vs. Eager Loading
Lazy Loading (default in TypeORM) loads relations only when accessed.
Eager Loading loads relations immediately with the query, reducing multiple DB hits.
Optimization: Use JOIN FETCH or eager loading only when necessary to prevent the "N+1 Query Problem".
✅ Reducing Nested Loops & Expensive Computations
Avoid deeply nested loops (O(n²) complexity).
Use batch processing, indexing, and bulk updates to reduce expensive operations.
🔹 3️⃣ Concurrency & Parallelism
✅ Handling CPU-Bound Tasks (Task-Based Parallelism)
For heavy computations, use:

Worker threads (worker_threads module in Node.js).
Background jobs (e.g., BullMQ + Redis).
✅ Handling I/O-Bound Tasks (Async Processing)
For slow DB queries, API calls, or file operations, use:

async/await with Promise.all for parallel execution.
Message queues (e.g., RabbitMQ, Kafka) to avoid blocking requests.

Lazy Loading vs. Eager Loading: A Clear Explanation
When working with databases and ORMs (like TypeORM in NestJS), we often fetch related data (e.g., a user’s orders, a product’s reviews). The way we load this related data can impact performance.

There are two main approaches:

Lazy Loading – Fetch related data only when needed (on-demand).
Eager Loading – Fetch related data immediately (when the main entity is queried).
✅ Lazy Loading (On-Demand Loading)
The related data is not loaded immediately.
Instead, it is fetched later only when accessed.
This reduces the initial query time but may cause extra queries when accessing related data.
📌 Example (Lazy Loading in TypeORM/NestJS)
ts
Copy
Edit
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;

@Column()
name: string;

@OneToMany(() => Order, (order) => order.user, { lazy: true }) // Lazy loading
orders: Promise<Order[]>; // Must be a Promise<> type
}
🔹 Here, the orders field is not loaded by default.
🔹 If we query User, it won’t fetch orders until we explicitly access user.orders.

✅ Lazy Loading Query
ts
Copy
Edit
const user = await userRepository.findOne({ where: { id: 1 } });
const orders = await user.orders; // This triggers a separate query
First query: Fetches the user only.
Second query (only when needed): Fetches the orders.
🔴 Potential Problem: If you have many related records, lazy loading can cause the "N+1 Query Problem", where multiple queries are executed instead of one.

✅ Eager Loading (Immediate Loading)
The related data is fetched immediately in the initial query.
This is faster if you know you'll need the related data.
However, it increases query complexity if the data isn’t always needed.
📌 Example (Eager Loading in TypeORM/NestJS)
ts
Copy
Edit
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;

@Column()
name: string;

@OneToMany(() => Order, (order) => order.user, { eager: true }) // Eager loading
orders: Order[];
}
🔹 Here, orders are always loaded whenever a User is queried.

✅ Eager Loading Query
ts
Copy
Edit
const user = await userRepository.findOne({ where: { id: 1 } });
console.log(user.orders); // Orders are already available
Only one query is executed, fetching both the user and orders together.
Better for performance when related data is always needed.
🔥 Key Differences: Lazy vs. Eager Loading
Feature Lazy Loading Eager Loading
When is related data loaded? When accessed Immediately
Query Performance Faster initial query Slower initial query
Number of Queries Multiple queries (N+1 problem) Single query
Flexibility Loads only when needed Always loads, even if unused
Best for When related data is rarely needed When related data is always needed
🚀 When to Use What?
Scenario Use Lazy Loading Use Eager Loading
You don’t always need related data ✅ ❌
You always need related data ❌ ✅
Too many extra queries (N+1 issue) ❌ ✅
Performance-critical queries ✅ (optimize with caching) ✅
🛠 Best Practice: Use Selective Eager Loading
Instead of always using eager loading, selectively fetch related data only when needed using JOINs or relations in queries.

✅ Example: Fetch Users with Orders Only When Needed
ts
Copy
Edit
const user = await userRepository.findOne({
where: { id: 1 },
relations: ['orders'], // Eager loading only for this query
});
🔹 This fetches users with their orders only when needed, avoiding unnecessary joins in every query.

🎯 Final Takeaways
✔ Lazy Loading: Loads data only when needed (avoids unnecessary data but can cause N+1 issues).
✔ Eager Loading: Loads related data immediately (better for frequently accessed relationships).
✔ Selective Loading: The best approach is loading related data only when necessary using query-based relations.

🚀 Next Steps
1️⃣ Profile queries using TypeORM Logging to see performance differences.
2️⃣ Optimize queries using indexes, pagination, and query builder.
3️⃣ Use caching to speed up frequently accessed data.

Let me know if you want real-world optimizations, query profiling, or database indexing strategies!

Offset-Based Pagination in SQL
Offset-based pagination retrieves a fixed number of records (LIMIT) after skipping a specific count (OFFSET).

SQL Query Example
sql
Copy
Edit
SELECT \* FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;
LIMIT 10 → Fetches 10 records.
OFFSET 20 → Skips the first 20 records.
ORDER BY created_at DESC → Ensures a consistent order.
Trade-offs of Offset-Based Pagination
✅ Easy to implement
✅ Works well for small datasets
❌ Performance issues for large datasets (OFFSET requires scanning skipped rows)
❌ Inconsistent results if data changes (new records shift page results)

3. Handling Data Consistency in Pagination
   Problems
   If new data is added between paginated requests, results may shift.
   Users might see duplicates or miss records.
   Solutions
1. Use Snapshotting (Consistent Reads)
   Capture a snapshot using a fixed timestamp.
   Query results based on records created before that timestamp.
1. Cursor-Based Pagination (Alternative to OFFSET)
   Instead of OFFSET, use a cursor (e.g., created_at, id).
   Fetch records after a specific cursor value.

   🔥 Improve Performance → Switch to cursor-based pagination.
   🔄 Ensure Data Consistency → Use snapshot timestamps.
   🚀 Optimize Queries → Add indexes on created_at.

Snapshotting (Consistent Reads)
The Problem with Offset-Based Pagination
When using OFFSET + LIMIT, users might see duplicate or missing data if records are inserted, deleted, or updated between requests.
Example:

User requests page 1 (offset=0, limit=10).
New records are added to the database.
User requests page 2 (offset=10, limit=10), but because new data shifted the results, they might:
See some records again (duplicates).
Miss some records (data shifting).
Solution: Capture a Snapshot
The idea is to freeze a version of the dataset at a specific time.
All paginated queries use the same snapshot timestamp to maintain consistency.
How to Implement Snapshot-Based Pagination
Step 1: Capture a Timestamp
When the first page request is made, generate a fixed timestamp.
This ensures that subsequent pages retrieve data from the same snapshot.
Step 2: Query Using That Timestamp
Modify queries to fetch records that were created before the snapshot timestamp.
created_at <= '2025-02-26 12:00:00' ensures that only records present at that time are retrieved.
Even if new records are inserted, the results will stay consistent across paginated requests.
