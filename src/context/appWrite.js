import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("696e106c000b9f41a7af");

export const account = new Account(client);

// import { Client, Account } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("PROJECT_ID"); // Appwrite Project ID

// export const account = new Account(client);
