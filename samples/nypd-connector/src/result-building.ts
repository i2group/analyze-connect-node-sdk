/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2023)
 * SPDX-License-Identifier: MIT
 */

import { records, schema as apiSchema, services } from '@i2analyze/i2connect';
import { IComplaintDto } from './data-service';

import { nypdcomplaintdataschema as schema } from './schema/nypd-complaint-data-schema';

const { Complaint, Location, Person } = schema.entityTypes;

const sourceReference = {
  name: 'NYPD Complaint Dataset',
  type: 'Open source data',
  description: 'A source reference to the corresponding record from the NYPD Complaint Dataset.',
};

export function addLocation(
  datum: IComplaintDto,
  result: services.IResult
): records.IResultEntityRecord<typeof Location> {
  const locationId = `Borough: ${datum.boro_nm} Precinct: ${datum.addr_pct_cd}`;
  const entity = result.addEntity(Location, locationId);

  entity.setProperties({
    'Precinct Code': parseInt(datum.addr_pct_cd, 10),
    'Borough Name': datum.boro_nm,
    Coordinates: {
      type: 'Point',
      coordinates: [parseFloat(datum.longitude), parseFloat(datum.latitude)],
    },
  });

  entity.setSourceReference(sourceReference);

  return entity;
}

export function addComplaint(
  datum: IComplaintDto,
  result: services.IResult
): records.IResultEntityRecord<typeof Complaint> {
  const complaintId = `Complaint: ${datum.cmplnt_num}`;
  const entity = result.addEntity(Complaint, complaintId);

  entity.setProperties({
    'Complaint Number': datum.cmplnt_num,
    'Crime Status': datum.crm_atpt_cptd_cd,
    'Jurisdiction Code': parseInt(datum.jurisdiction_code, 10),
    'Offence Classification Code': parseInt(datum.ky_cd, 10),
    'Level Of Offence': datum.law_cat_cd,
    'Offence Description': datum.ofns_desc,
  });

  entity.setSourceReference(sourceReference);

  return entity;
}

export function addSuspect(
  datum: IComplaintDto,
  result: services.IResult
): records.IResultEntityRecord<typeof Person> {
  const suspectId = `Suspect: ${datum.cmplnt_num}`;
  const entity = result.addEntity(Person, suspectId);

  entity.setProperties({
    'Age Group': datum.susp_age_group,
    Race: datum.susp_race,
    Sex: datum.susp_sex,
  });

  entity.setSourceReference(sourceReference);

  return entity;
}

export function addVictim(
  datum: IComplaintDto,
  result: services.IResult
): records.IResultEntityRecord<typeof Person> {
  const victimId = `Victim: ${datum.cmplnt_num}`;
  const entity = result.addEntity(Person, victimId);

  entity.setProperties({
    'Age Group': datum.vic_age_group,
    Race: datum.vic_race,
    Sex: datum.vic_sex,
  });

  entity.setSourceReference(sourceReference);

  return entity;
}

export function addLink(
  linkType: apiSchema.ILinkType,
  id: string,
  fromEnd: records.IResultLinkRecordEnd,
  toEnd: records.IResultLinkRecordEnd,
  result: services.IResult
): void {
  const link = result.addLink(linkType, id, fromEnd, toEnd);
  link.setSourceReference(sourceReference);
}
