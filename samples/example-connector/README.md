# Example connector

The `example-connector` provides eleven services that return data from a hardcoded data set:

- **Example Search** demonstrates how to specify a form that users can interact with.
- **Example Seeded Search 1 ('find like this')** demonstrates how to find records that are similar to a set of Person seed records.
- **Example Seeded Search 2 ('expand')** demonstrates how to expand a set of Person seed records to find connections to other records.
- **Example Seeded Search 3 ('edit property values')** demonstrates how to update property values of the seed records provided to the search.
- **Async Example Search** demonstrates how to create an asynchronous query that can report progress back to the user through the use of substatus messages.
- **API Key Authenticated Search** demonstrates how to request an API key from a user in order to run the service.
- **Search Within a Data Source** demonstrates how to change the behavior of a service based on data in the request.
- **Semantic Property Search** demonstrates how to require seed records that have values for properties with specific semantic types.
- **Search for Stations Within an Area** demonstrates how to use the `geospatialArea` logical type in a service.
- **Example Search with Custom Source Identifiers** is similar to **Example search**, but also demonstrates how to use source identifiers.
- **Example Seeded Search 2 ('expand') with Custom Source Identifiers** is similar to **Example Seeded Search 2 ('expand')**, but also demonstrates how to use source identifiers.

## Running the example connector

You can run the example connector by executing an npm package directly, or by cloning its repository.

### Running without cloning the repository

Execute the following command:

```sh
npx @i2analyze/example-connector
```

After the server starts, its configuration is available at `http://localhost:3700/config`.

**Note:** To configure the connector, you can use environment variables, as defined in [Configuring the connector server](https://i2group.github.io/analyze-connect-node-sdk/guide/deploying-connectors.html).
The connector also uses [dotenv](https://www.npmjs.com/package/dotenv) to load any `.env` configuration files in the working directory.

### Running the server during development

To run the server in development mode:

1. Clone the [repository](https://github.com/i2group/analyze-connect-node-sdk).

1. Navigate to the `samples/example-connector` directory.

1. Install the packages that the server requires.

   ```shell
   npm install
   ```

1. Build the service and start the connector server:

   ```shell
   npm start
   ```

In this mode, the server monitors the project source files for changes, and rebuilds the service if necessary.
