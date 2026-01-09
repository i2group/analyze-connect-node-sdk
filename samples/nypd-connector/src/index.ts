/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2025)
 * SPDX-License-Identifier: MIT
 */

import { startConnector, addService, registerStorage } from '@i2analyze/i2connect';

import { addComplaint, addLocation, addSuspect, addVictim, addLink } from './result-building';
import { requestData } from './data-service';

import { nypdcomplaintdataschema as schema } from './schema/nypd-complaint-data-schema';
import * as fs from 'fs';
import * as path from 'path';

const { Complaint, Location } = schema.entityTypes;
const { Locatedat, Suspectof, Victimof } = schema.linkTypes;

const file1Id = 'file1.png';
const storage = registerStorage({authHandler: (fileId, userInformation) => {
  const canAccessFile1 = userInformation.sub === 'Jenny';
  if(fileId === file1Id && !canAccessFile1) {
    throw new Error('You do not have permission to view this resource')
  }
}});

addService(
  {
    id: 'getAll',
    name: 'NYPD Connector: Get all',
    description: 'A service that retrieves all data.',
  },
  async ({ result }) => {
    // The maximum number of rows returned from the NYPD complaint dataset
    const data = await requestData({ $limit: '100' });

    for (const datum of data) {
      const locationEntity = addLocation(datum, result);
      const complaintEntity = addComplaint(datum, result);
      const suspectEntity = addSuspect(datum, result);
      const victimEntity = addVictim(datum, result);

      addLink(Locatedat, datum.cmplnt_num, complaintEntity, locationEntity, result);
      addLink(Victimof, datum.cmplnt_num, victimEntity, complaintEntity, result);
      addLink(Suspectof, datum.cmplnt_num, suspectEntity, complaintEntity, result);
    }
  }
);

addService(
  {
    id: 'findComplaint',
    name: 'NYPD Connector: Search',
    description: 'A service for conditional searches.',
    form: {
      borough: {
        label: 'Borough name',
        logicalType: 'selectedFromList',
        isMandatory: true,
        possibleValues: [
          { displayValue: 'BROOKLYN', value: 'BROOKLYN' },
          { displayValue: 'BRONX', value: 'BRONX' },
          { displayValue: 'MANHATTAN', value: 'MANHATTAN' },
          { displayValue: 'QUEENS', value: 'QUEENS' },
          { displayValue: 'STATEN ISLAND', value: 'STATEN ISLAND' },
        ],
      },
      lawCategory: {
        label: 'Law category',
        logicalType: 'selectedFromList',
        isMandatory: true,
        possibleValues: [
          { displayValue: 'FELONY', value: 'FELONY' },
          { displayValue: 'MISDEMEANOR', value: 'MISDEMEANOR' },
          { displayValue: 'VIOLATION', value: 'VIOLATION' },
        ],
      },
    },
  },
  async ({ conditions: { borough, lawCategory }, result }) => {
    const data = await requestData({
      $limit: '50',
      $where: `boro_nm="${borough}" AND law_cat_cd="${lawCategory}"`,
    });

    for (const datum of data) {
      addComplaint(datum, result);
    }
  }
);

addService(
  {
    id: 'findSimilarComplaint',
    name: 'NYPD Connector: Find like this complaint',
    description: 'A service that finds a similar complaint.',
    seedConstraints: { typeConstraints: [Complaint], min: 1, max: 1 },
  },
  async ({ seeds, result }) => {
    const seed = seeds.entities[0];
    const levelOfOffence = (seed.isType(Complaint) && seed.getProperty('Level Of Offence')) || '';

    const data = await requestData({
      $limit: '50',
      $where: `law_cat_cd="${levelOfOffence}"`,
    });

    for (const datum of data) {
      addComplaint(datum, result);
    }
  }
);

addService(
  {
    id: 'expand',
    name: 'NYPD Connector: Expand',
    description: 'A service that executes an expand operation on a seed.',
    seedConstraints: { typeConstraints: [Complaint, Location], min: 1, max: 1 },
  },
  async ({ seeds, result }) => {
    const seed = seeds.entities[0];
    const complaintNumber = (seed.isType(Complaint) && seed.getProperty('Complaint Number')) || '';
    const boroughName = (seed.isType(Location) && seed.getProperty('Borough Name')) || '';
    const precinctCode = (seed.isType(Location) && seed.getProperty('Precinct Code')) || '';

    const query = seed.isType(Complaint)
      ? { $where: `cmplnt_num="${complaintNumber}"` }
      : { $where: `boro_nm="${boroughName}" AND addr_pct_cd=${precinctCode}` };

    const data = await requestData({
      $limit: '50',
      ...query,
    });

    const seedEntity = seed.isType(Complaint)
      ? result.addEntityFromSeed(seed)
      : result.addEntityFromSeed(seed);

    for (const datum of data) {
      const complaintEntity = seed.isType(Complaint) ? seedEntity : addComplaint(datum, result);
      const locationEntity = seed.isType(Location) ? seedEntity : addLocation(datum, result);

      const suspectEntity = addSuspect(datum, result);
      const victimEntity = addVictim(datum, result);

      addLink(Locatedat, datum.cmplnt_num, complaintEntity, locationEntity, result);
      addLink(Victimof, datum.cmplnt_num, victimEntity, complaintEntity, result);
      addLink(Suspectof, datum.cmplnt_num, suspectEntity, complaintEntity, result);
    }
  }
);

addService(
  {
    id: 'expandWithConditions',
    name: 'NYPD Connector: Expand with conditions',
    description: 'A service that executes an expand operation on a seed, with conditions.',
    seedConstraints: { typeConstraints: [Complaint], min: 1, max: 1 },
    form: {
      isPerson: { label: 'Person', logicalType: 'boolean' },
    },
  },
  async ({ conditions: { isPerson }, seeds, result }) => {
    const seed = seeds.entities[0];
    const complaintNumber = (seed.isType(Complaint) && seed.getProperty('Complaint Number')) || '';

    const data = await requestData({
      $limit: '50',
      $where: `cmplnt_num="${complaintNumber}"`,
    });

    const seedEntity = result.addEntityFromSeed(seed);

    for (const datum of data) {
      if (isPerson) {
        const suspectEntity = addSuspect(datum, result);
        const victimEntity = addVictim(datum, result);

        addLink(Suspectof, datum.cmplnt_num, suspectEntity, seedEntity, result);
        addLink(Victimof, datum.cmplnt_num, victimEntity, seedEntity, result);
      }

      const locationEntity = addLocation(datum, result);
      addLink(Locatedat, datum.cmplnt_num, seedEntity, locationEntity, result);
    }
  }
);

addService(
  {
    id: 'getAllLocations',
    name: 'NYPD Connector: Get all locations',
    description: 'A service that retrieves all location data with static source references.',
  },
  async ({ result }) => {
    // The maximum number of rows returned from the NYPD complaint dataset
    const data = await requestData({ $limit: '100' });
    
    const pngFilePath = path.join(__dirname, 'charting-scheme-labelled.png')
    const pngFile = fs.readFileSync(pngFilePath);
    await storage.writeFile({fileId: file1Id, fileContent: pngFile});

    for (const datum of data) {
      const locationEntity = addLocation(datum, result);

      locationEntity.setStaticSourceReference?.({
        fileId: file1Id,
        name: 'test file',
        fileType: 'image'
      });
    }
  }
);

startConnector({
  schemas: { connector: schema },
  hasPersistentResultIds: true,
});
