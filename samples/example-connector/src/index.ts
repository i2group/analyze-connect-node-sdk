/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2023)
 * SPDX-License-Identifier: MIT
 */

import {
  addService,
  AuthenticationRequiredError,
  createAuthenticator,
  data,
  DetailedError,
  records,
  services,
  startConnector,
} from '@i2analyze/i2connect';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import * as jwt from 'jsonwebtoken';
import { asyncLookupPeople, IPerson, lookupPeople } from './data-access';
import { schema as exampleSchema } from './schema/schema';

const { Person, Tweet, Address } = exampleSchema.entityTypes;
const { Friendswith } = exampleSchema.linkTypes;

const testSecret = 'test 2';
function verifyJWT(token: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, testSecret, (err) => {
      if (err) {
        reject(
          new AuthenticationRequiredError({
            status: 401,
            title: `A '${err.name}' occurred when verifying the token.`,
          })
        );
        return;
      }

      resolve(true);
    });
  });
}

/**
 * Determines whether a substring occurs within a supplied string, using a case-insensitive comparison.
 * @param source - The string to search for a substring within.
 * @param searchValue - The substring to search for within the source string.
 */
function caseInsensitiveContains(source: string, searchValue: string): boolean {
  return source.toLowerCase().includes(searchValue.toLowerCase());
}

// This is the source identifier type that should be unique
const customSourceIdentifierType = 'This value should be unique to your data source - do not reuse';

/**
 * Creates a custom source identifier from the given id.
 * @param id - The id of the data record.
 * @returns The source identifier.
 */
function createCustomSourceIdentifier(id: string): records.ISourceIdentifier {
  return {
    type: customSourceIdentifierType,
    key: [id],
  };
}

/**
 * Adds a person to the result object and sets properties to a Person record using the external data.
 * @param person - The person data from the external source.
 * @param result - The Result object.
 * @param idFactory - An optional identifier factory.
 * @param id - The id of the person.
 */
function addPersonToResult(
  person: IPerson,
  result: services.IResult,
  idFactory: (id: string) => records.ResultRecordIdType = (id) => id
) {
  const { forename, surname, dob, ssn, issuedDateAndTime } = person;

  const id = idFactory(person.id);
  const resultEntity = result.addEntity(Person, id);

  resultEntity.setProperty('First Name', forename);
  resultEntity.setProperty('Last Name', surname);
  resultEntity.setProperty('Year of Birth', dob);

  // Calculate the rough age from the year of birth
  resultEntity.setProperty('Age', new Date().getFullYear() - new Date(dob).getFullYear());

  resultEntity.setProperty('SSN', ssn);

  // Construct the date of issue for the SSN
  resultEntity.setProperty('SSN Issued Date and Time', {
    localDateAndTime: issuedDateAndTime,
    timeZoneId: 'Europe/London',
    isDST: false,
  });

  resultEntity.setSourceReference({
    name: 'Example source name',
    type: 'Example source type',
    description: 'An example source reference from a connected data source',
  });

  return resultEntity;
}

/**
 * Extracts identifiers from the keys of connected seeds
 * @param connectorKeys - The connector keys to query
 * @returns The set of data identifiers from connected sources
 */
function extractIdsFromConnectorKeys(connectorKeys: readonly records.IConnectorKey[]) {
  const ids = connectorKeys.map((connectorKey) => connectorKey.id);
  return new Set(ids);
}

/**
 * A function simulating an asynchronous call to a service to determine whether the user can select a data source when searching.
 */
function canUserSelectRestrictedDataSource(requestInformation: services.IRequestInformation) {
  return Promise.resolve(requestInformation.user.groups.includes('RestrictedDataSourceAccess'));
}

/**
 * A function simulating an asynchronous call to a service to return Possible Value information
 */
function possibleValueDataSources() {
  return Promise.resolve([
    { value: 'dataSource1', displayValue: 'Data Source 1' },
    { value: 'dataSource2', displayValue: 'Data Source 2' },
    { value: 'dataSource3', displayValue: 'Data Source 3' },
    { value: 'dataSource4', displayValue: 'Data Source 4' },
  ]);
}

/**
 * A function simulating the searching of a data source.
 */
function getSearchResultsFromDataSource(
  dataSourceId: string,
  searchTerm: string
): Promise<string[]> {
  const tweetText = (index: number) =>
    `tweet ${index} containing search term '${searchTerm}'from data source '${dataSourceId}'`;

  return Promise.resolve([tweetText(1), tweetText(2)]);
}

const wildcardSearchTerm = '*';
const nameContainsSearchCondition = {
  label: 'Name contains',
  isMandatory: true,
  logicalType: 'singleLineString',
  defaultValue: wildcardSearchTerm,
} as const;

/**
 * Find people in the dataset matching the provided term
 *
 * @param term - The search term to use.
 * @param result - The result builder to use.
 * @param idFactory - The factory for generating result record identifiers.
 * @returns The result object with any matched people.
 */
function findPeople(
  term: string,
  result: services.IResult,
  idFactory?: (id: string) => records.ResultRecordIdType
) {
  const predicate = (person: IPerson) => {
    // Use the search term to filter the data set
    // "term" is a mandatory condition, so it always has a value but will default to "*"
    return (
      term === wildcardSearchTerm ||
      caseInsensitiveContains(person.forename, term) ||
      caseInsensitiveContains(person.surname, term)
    );
  };

  const people = lookupPeople(predicate);
  for (const person of people) {
    addPersonToResult(person, result, idFactory);
  }
}

/**
 * A function that returns friends connected to the Person seeds
 *
 * @param seeds - The incoming seed information.
 * @param result - The result builder to use.
 * @param idFactory - The factory for generating result identifiers given a string id.
 * @param extractIdsFromSeed - The function to extract the relevant ids for the given seed.
 * @returns The result object containing the seeds and their friends.
 */
function getFriendsLinkedToSeeds(
  seeds: services.ISeeds,
  result: services.IResult,
  extractIdsFromSeed: (seed: records.ISeedEntityRecord) => Set<string>,
  idFactory: (id: string) => records.ResultRecordIdType = (id) => id
) {
  for (const seed of seeds.entities) {
    // Find all people in the data set for this seed
    const people = lookupPeople((person) => extractIdsFromSeed(seed).has(person.id));

    for (const person of people) {
      // Look up the friends
      const friendIds = new Set(person.friends);
      const friends = lookupPeople((friend) => friendIds.has(friend.id));

      for (const friend of friends) {
        const personEntity = addPersonToResult(person, result, idFactory);
        const friendEntity = addPersonToResult(friend, result, idFactory);

        // Construct a unique and deterministic identifier for the link, given the two end identifiers in the data set
        const linkId = idFactory([person.id, friend.id].sort().join('-'));

        result.addLink(Friendswith, linkId, personEntity, friendEntity);
      }
    }
  }

  return result;
}

addService(
  {
    id: 'exampleSearch',
    name: 'Example Search',
    description: `An example that queries a data set of people by searching for text in their names. You can also use '${wildcardSearchTerm}' to retrieve all data.`,
    resultItemTypes: [Person],
    form: {
      term: nameContainsSearchCondition,
    },
  },
  ({ conditions: { term }, result }) => {
    findPeople(term, result);
  }
);

addService(
  {
    id: 'exampleSeededSearch1',
    name: "Example Seeded Search 1 ('find like this')",
    description:
      'An example that queries a data set of people to find targets similar to those supplied as seeds, according to their given name, family name, or year of birth.',
    resultItemTypes: [Person],
    seedConstraints: { typeConstraints: [Person], min: 1, max: 1 },
    form: {
      useYearOfBirth: {
        label: 'Consider year of birth',
        isMandatory: false,
        logicalType: 'boolean',
      },
    },
  },
  ({ conditions: { useYearOfBirth }, seeds, result }) => {
    // Pull out the seed
    const seed = seeds.entities[0];
    const forename = (seed.isType(Person) && seed.getProperty('First Name')) || '';
    const surname = (seed.isType(Person) && seed.getProperty('Last Name')) || '';
    const dob = seed.isType(Person) && seed.getProperty('Year of Birth');

    const connectorKeys = seed.connectorKeysByType(Person);
    const connectorKeyIds = extractIdsFromConnectorKeys(connectorKeys);

    const predicate = (person: IPerson) => {
      // Filter out records that are known to be charted, to prevent duplicates
      if (connectorKeyIds.has(person.id)) {
        return false;
      }

      // Look for people with the same given name, family name, or year of birth
      // But exclude the seed from the response
      return (
        person.forename.localeCompare(forename) === 0 ||
        person.surname.localeCompare(surname) === 0 ||
        (!!useYearOfBirth && !!dob && data.createLocalDate(person.dob).year === dob.year)
      );
    };

    const people = lookupPeople(predicate);
    for (const person of people) {
      addPersonToResult(person, result);
    }
  }
);

addService(
  {
    id: 'exampleSeededSearch2',
    name: "Example Seeded Search 2 ('expand')",
    description:
      'An example that queries a data set of people to find the friends of those supplied as seeds.',
    resultItemTypes: [Person, Friendswith],
    seedConstraints: { typeConstraints: [Person], min: 1, max: 10 },
  },
  ({ result, seeds }) => {
    getFriendsLinkedToSeeds(seeds, result, (seed) => {
      const connectorKeys = seed.connectorKeysByType(Person);
      // If a chart item contains multiple records, a single seed can have multiple connector key identifiers
      return extractIdsFromConnectorKeys(connectorKeys);
    });
  }
);

addService(
  {
    id: 'exampleSeededSearch3',
    name: "Example Seeded Search 3 ('edit property values')",
    description:
      'An example that populates or replaces the middle names of people supplied as seeds.',
    resultItemTypes: [Person],
    seedConstraints: { typeConstraints: [Person], min: 1, max: 10 },
  },
  ({ seeds, result }) => {
    for (const seed of seeds.entities) {
      if (seed.isType(Person)) {
        const resultEntity = result.addEntityFromSeed(seed);
        // Override or add the middle name property value
        resultEntity.setProperty('Middle Name', 'Returned middle name');
      }
    }
  }
);

addService(
  {
    id: 'asyncExampleSearch',
    name: 'Async Example Search',
    description:
      'An example async query that returns all the people and has a default polling interval of 1 s.\n\nThe query will also provide a substatus with the query start time.',
    longRunning: { pollingIntervalInSeconds: 1 },
    resultItemTypes: [Person],
    form: {
      seconds: {
        label: 'Duration in seconds',
        isMandatory: false,
        logicalType: 'integer',
        minValue: 0,
        defaultValue: 10,
      },
      shouldFail: {
        label: 'Should fail',
        isMandatory: false,
        logicalType: 'boolean',
        defaultValue: false,
      },
    },
  },
  async ({ conditions: { seconds, shouldFail }, longRunningState, result }) => {
    const startDateTime = new Date();
    longRunningState.addSubstatus('information', `Query started - ${startDateTime.toUTCString()}`);

    const durationSeconds = seconds || 10;
    const people = await asyncLookupPeople(() => true, durationSeconds, !!shouldFail);

    for (const person of people) {
      addPersonToResult(person, result);
    }
  }
);

const apiKeyAuthenticator = createAuthenticator(
  {
    id: 'loginApiKey',
    description: "This service requires authentication. The valid API key is 'Example'.",
    form: {
      apikey: { label: 'API key', type: 'password' },
    },
  },
  ({ conditions: { apikey } }) => {
    if (apikey === 'Example') {
      const token = jwt.sign({}, testSecret, { expiresIn: 60 });
      return token;
    } else {
      throw new DetailedError({
        title: 'Invalid credentials',
        detail: 'Refer to the authenticator configuration for details.',
        status: 401,
        type: 'https://example.com',
        instance: 'instance url',
      });
    }
  }
);

addService(
  {
    id: 'apiAuthSearch',
    name: 'API Key Authenticated Search',
    description: 'An API key authenticated service. Authentication tokens expire after 1 min.',
    authenticator: apiKeyAuthenticator,
  },
  async ({ authToken, result }) => {
    await verifyJWT(authToken);

    const tweets = [
      {
        id: 'tweet-1',
        user: 'user1',
        contents: 'My first tweet',
      },
      {
        id: 'tweet-2',
        user: 'user2',
        contents: "It's hot today",
      },
    ];

    for (const tweet of tweets) {
      const resultEntity = result.addEntity(Tweet, tweet.id);
      resultEntity.setProperty('Contents', tweet.contents);
      resultEntity.setProperty('User name', tweet.user);
      resultEntity.setProperty('Length', tweet.contents.length);
    }
  }
);

/**
 * This demonstrates the ability to customize a service and its conditions based on request information.
 */
addService(
  {
    id: 'searchSelectedDataSource',
    name: 'Search Within a Data Source',
    description: async (requestInformation: services.IRequestInformation) => {
      // The description of the service can be customized based on request information.
      return (await canUserSelectRestrictedDataSource(requestInformation))
        ? 'A service which can search a selection of data sources'
        : 'A service which can search a single data source';
    },
    hide: (requestInformation: services.IRequestInformation) => {
      // Hide this service from anyone who isn't a member of the group "DataSourceAccess".
      return !requestInformation.user.groups.includes('DataSourceAccess');
    },
    form: {
      // A condition that allows a value to be chosen from a set of values which is dependant on request information.

      dataSource: {
        label: 'Choose data source',
        logicalType: 'selectedFromList',
        possibleValues: async () => {
          // Get the set of data sources the user can choose from.
          return await possibleValueDataSources();
        },
        defaultValue: async () => {
          const dataSources = await possibleValueDataSources();
          // Default to the first available data source
          // Note: when dealing with a condition which is based on a set of possible values, the "value" property should be used for the default value
          return dataSources[0].value;
        },
        // Determine whether this condition should be hidden based on the request information.
        hide: (requestInformation: services.IRequestInformation) =>
          canUserSelectRestrictedDataSource(requestInformation),
      },

      searchTerm: {
        label: 'Search Term',
        logicalType: 'singleLineString',
        isMandatory: true,
      },
    },
  },
  async ({ conditions: { dataSource, searchTerm }, result }) => {
    /* If the dataSource condition wasn't visible to the user it will come through as undefined
       in this case default to 'dataSource1'. */
    const searchResults = await getSearchResultsFromDataSource(
      dataSource || 'dataSource1',
      searchTerm
    );

    // Output the results.
    for (const searchResult of searchResults) {
      const resultEntity = result.addEntity(Tweet, 'tweet-1');
      resultEntity.setProperty('Contents', searchResult);
      resultEntity.setProperty('User name', 'user1');
      resultEntity.setProperty('Length', searchResult.length);
    }
  }
);

const properties = {
  PersonFirstName: 'guid4DE7370B-60E5-4EB0-860E-4066D3DFD7B6',
  PersonLastName: 'guid62B01C18-2E64-46D5-B2FF-3C69B4F76FEB',
};
addService(
  {
    id: 'semanticPropertySearch',
    name: 'Semantic Property Search',
    description: 'A semantic property search.',

    semanticSeedConstraints: {
      min: 1,
      max: 5,

      semanticPropertyTypeIds: {
        recordsWithFirstLastName: [properties.PersonFirstName, properties.PersonLastName],
      },
    },
  },
  ({ result, semanticSeeds }) => {
    for (const semanticSeed of semanticSeeds.recordsWithFirstLastName) {
      const firstNameMatches = semanticSeed.getAsStrings(properties.PersonFirstName);
      const lastNameMatches = semanticSeed.getAsStrings(properties.PersonLastName);

      if (firstNameMatches && lastNameMatches) {
        for (const fn of firstNameMatches) {
          for (const ln of lastNameMatches) {
            const people = lookupPeople(
              (p) =>
                caseInsensitiveContains(p.forename, fn) && caseInsensitiveContains(p.surname, ln)
            );
            for (const person of people) {
              addPersonToResult(person, result);
            }
          }
        }
      }
    }
  }
);

addService(
  {
    id: 'pointWithinAreaService',
    name: 'Search for Stations Within an Area',
    form: {
      area: {
        label: 'The area',
        logicalType: 'geospatialArea',
        isMandatory: true,
        defaultValue: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [-0.725756, 51.198028],
                    [-0.725756, 51.750276],
                    [0.402121, 51.750276],
                    [0.402121, 51.198028],
                    [-0.725756, 51.198028],
                  ],
                ],
              },
            },
          ],
        },
      },
    },
  },
  ({ conditions: { area }, result }) => {
    function pointWithinArea(point: data.GeoJsonPosition) {
      return area.features.some((feature: data.IGeoJsonFeature) =>
        booleanPointInPolygon(point, feature)
      );
    }

    const addresses: {
      id: string;
      postcode: string;
      firstLine: string;
      coordinates: [number, number];
    }[] = [
      {
        id: 'address-1',
        firstLine: 'Piccadilly Circus Station',
        postcode: 'W1J 9HP',
        coordinates: [-0.133869, 51.510067],
      },
      {
        id: 'address-2',
        firstLine: 'Temple Station',
        postcode: 'WC2R 2PH',
        coordinates: [-0.1142, 51.511],
      },
      {
        id: 'address-3',
        firstLine: 'Hyde Park Corner Station',
        postcode: 'SW1X 7LY',
        coordinates: [-0.15278, 51.50278],
      },
      {
        id: 'address-4',
        firstLine: 'Birmingham New Street Station',
        postcode: 'B2 4QA',
        coordinates: [-1.899, 52.4778],
      },
      {
        id: 'address-5',
        firstLine: 'Beasdale Station',
        postcode: 'PH39 4NR',
        coordinates: [-5.7636, 56.9002],
      },
    ];

    for (const address of addresses) {
      if (pointWithinArea(address.coordinates)) {
        const resultEntity = result.addEntity(Address, address.id);
        resultEntity.setProperty('First line', address.firstLine);
        resultEntity.setProperty('Postcode', address.postcode);
        resultEntity.setProperty('Coordinates', {
          type: 'Point',
          coordinates: address.coordinates,
        });
      }
    }
  }
);

addService(
  {
    id: 'exampleSearchWithCustomSourceIdentifiers',
    name: 'Example Search with Custom Source Identifiers',
    description: `An example that queries a data set of people by searching for text in their names. You can also use '${wildcardSearchTerm}' to retrieve all data.`,
    resultItemTypes: [Person],
    form: {
      term: nameContainsSearchCondition,
    },
  },
  ({ conditions: { term }, result }) => {
    findPeople(term, result, createCustomSourceIdentifier);
  }
);

addService(
  {
    id: 'exampleSearchWithDateAndTime',
    name: 'Example Search to find issued Date And Time',
    description: `An example that queries a data set of people by searching for the issued Date And Time.`,
    resultItemTypes: [Person],
    form: {
      dateTime: {
        label: 'Date',
        isMandatory: false,
        logicalType: 'dateAndTime',
      },
    },
  },
  ({ conditions: { dateTime }, result }) => {
    const predicate = (person: IPerson) => {
      return (
        !!dateTime &&
        caseInsensitiveContains(person.issuedDateAndTime, dateTime.dateTime.toISOString())
      );
    };

    const people = lookupPeople(predicate);
    for (const person of people) {
      addPersonToResult(person, result, () => person.id);
    }
  }
);

addService(
  {
    id: 'exampleSeededSearch2WithCustomSourceIdentifiers',
    name: "Example Seeded Search 2 ('expand') with Custom Source Identifiers",
    description:
      'An example that queries a data set of people to find the friends of those supplied as seeds using custom source identifiers.',
    resultItemTypes: [Person, Friendswith],
    seedConstraints: { typeConstraints: [Person], min: 1, max: 10 },
  },
  ({ seeds, result }) => {
    getFriendsLinkedToSeeds(
      seeds,
      result,
      (seed) => {
        const ids = seed.sourceIdentifiers

          // Filter out any source identifiers that do not match the custom type defined in this connector
          .filter((id) => id.type === customSourceIdentifierType)

          // Extract the id from the key of the custom source identifier. As
          // we know the id of the person is at position 0 in the array
          .map((sourceIdentifier) => sourceIdentifier.key[0]);

        return new Set(ids);
      },
      createCustomSourceIdentifier
    );
  }
);

startConnector({
  schemas: {
    connector: {
      ...exampleSchema,
      schemaShortName: 'Example Connector',
    },
  },
  hasPersistentResultIds: true,
});
