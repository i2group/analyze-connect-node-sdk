# NYPD connector

The `nypd-connector` makes requests to the Socrata [NYC Open Data API](https://dev.socrata.com/foundry/data.cityofnewyork.us/d6zx-ckhd).

> **Note:** The API throttles requests by IP address. To raise the throttling limits, you must acquire an app token. For more information, see [Create a Socrata app token](https://i2group.github.io/analyze-connect-node-sdk/guide/walkthrough/3-connect-to-eds.html#create-an-app-token).
>
> When you have an app token, follow the instructions in `.env.sample`.

The connector provides five services:

- **NYPD Connector: Get all** demonstrates how to retrieve records of all types, subject to a numeric limit.
- **NYPD Connector: Search** demonstrates how to search for Complaint records that can be filtered by a number of conditions.
- **NYPD Connector: Find like this complaint** demonstrates how to search for similar records to a set of Complaint seed records.
- **NYPD Connector: Expand** demonstrates how to expand a set of seed records.
- **NYPD Connector: Expand with conditions** demonstrates how to expand a set of seed records, and allows conditions to be applied to the operation.

## Running the server during development

To run the server in development mode:

1. Install the packages that the server requires.

   ```shell
   npm install
   ```

1. Build the service and start the connector server:

   ```shell
   npm start
   ```

In this mode, the server monitors the project source files for changes, and rebuilds the service if necessary.
