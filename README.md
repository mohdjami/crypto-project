Deployed Link:

http://13.60.92.215/
Use AWS ECS for deploying the docker container.

GitHub Link: https://github.com/mohdjami/crypto-project

Docker Image: https://hub.docker.com/r/mohdjami/koinx-assignment

Requirements
**Develop a Server Side Application to fetch Real time data and process it.**

**Mandatory Tasks:-**

Task 1:

Previously the request was taking more than 2 seconds to process.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/32c8d686-cb3a-45e8-9bfc-53380f009e76/4f1b05d2-52c7-4e55-a92e-862621b1e740/image.png)

I utilized cron jobs.

For scalability: If there are multiple instances I have used Lock mechanism through redis. The instance which will acquire the lock only it will perform the task.

Here is what I did:

```jsx
cron.schedule("0 */2 * * *", async () => {
  console.log("Cron job started");
  const lock = "cryptoDataFetched";
  const ttl = 1000 * 60 * 10;
  try {
    const isLocked = await acquireLock(lock, ttl);
    if (!isLocked) {
      console.log(
        "Another instance is already fetching Data. Skipping this run."
      );
      return;
    }
    fetchCryptoData();
  } catch (error) {
    console.error("Error fetching Data", error);
  } finally {
    await releaseLock(lock);
  }
});
```

Task2:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/32c8d686-cb3a-45e8-9bfc-53380f009e76/6c946eb5-2df9-461b-bc32-aa9f08c4f889/image.png)

Response

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/32c8d686-cb3a-45e8-9bfc-53380f009e76/d889dcba-bdbf-4c4b-8503-52258ff614d1/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/32c8d686-cb3a-45e8-9bfc-53380f009e76/f60696f8-4593-4f1c-8d85-c375fec66b6c/image.png)

Results for prices = [ 40000, 45000, 50000 ]

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/32c8d686-cb3a-45e8-9bfc-53380f009e76/5c951c22-194c-42f4-aeab-38d5dcf3276e/image.png)

Deployment:

Dockerized the application and used docker-compose.
After setting up the env variables
You can run the application with just one command docker compose up.

Or build the image with docker run command.

http://13.60.92.215/
Use AWS ECS for deploying the docker container.

Use AWS EC2 instance.

Use Kubernetes for managing multiple services like Nodejs app, Mongodb and Redis, Helm as package manager and deploy it on AWS.

Testing

Run npm run test for testing the application and all tasks at once.
