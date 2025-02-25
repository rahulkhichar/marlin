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
