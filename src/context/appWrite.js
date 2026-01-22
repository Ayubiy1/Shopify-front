import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("PROJECT_ID"); // Appwrite Project ID

export const account = new Account(client);
