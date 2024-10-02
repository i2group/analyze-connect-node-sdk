/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2023)
 * SPDX-License-Identifier: MIT
 */

import { DetailedError } from '@i2analyze/i2connect';
import * as fs from 'fs';
import * as path from 'path';

export interface IPerson {
  /**
   * The identifier for the data in its source.
   */
  readonly id: string;
  /**
   * The forename of the person.
   */
  readonly forename: string;
  /**
   * The surname of the person.
   */
  readonly surname: string;
  /**
   * The date of birth of the person.
   */
  readonly dob: string;
  /**
   * The social security number of the person.
   */
  readonly ssn: string;
  /**
   * The date and time when the social security number was issued.
   */
  readonly issuedDateAndTime: string;
  /**
   * Identifiers of the friends of the person.
   */
  readonly friends: string[];
  /**
   * An image of the person.
   */
  readonly image: string;
}

type LookupPredicate = (person: IPerson) => boolean;

const people = (
  JSON.parse(fs.readFileSync(path.join(__dirname, '../people.json'), 'utf8')) as {
    people: IPerson[];
  }
).people;

/**
 * Queries the people data set to find one or more matching person entities.
 * @param predicate - The predicate to filter the data set.
 * @returns The people that pass the filter.
 */
export function lookupPeople(predicate: LookupPredicate): IPerson[] {
  return people.filter(predicate);
}

/**
 * Asynchronously queries the people data set to find one or more matching person entities with a synthetic delay.
 *
 * @param predicate - The predicate to filter the data set.
 * @param durationSeconds - The duration of the query for demonstration purposes.
 * @param shouldFail - Whether the request should fail.
 * @returns The people that pass the filter.
 */
export function asyncLookupPeople(
  predicate: LookupPredicate,
  durationSeconds: number,
  shouldFail: boolean
): Promise<IPerson[]> {
  const promise = new Promise<IPerson[]>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(
          new DetailedError({
            detail: 'Search failed.',
          })
        );
      } else {
        resolve(people.filter(predicate));
      }
    }, durationSeconds * 1000);
  });

  return promise;
}
