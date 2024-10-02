/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2023)
 * SPDX-License-Identifier: MIT
 */

import { settings } from '@i2analyze/i2connect';
import fetch from 'node-fetch';
import { URL } from 'url';

const baseUrl = settings.getString('socrata_url', true);
const token = settings.getString('token');

export interface IComplaintDto {
  /** Complaint number */
  readonly cmplnt_num: string;
  /** Crime status */
  readonly crm_atpt_cptd_cd: string;
  /** Jurisdiction code */
  readonly jurisdiction_code: string;
  /** Offense classification code */
  readonly ky_cd: string;
  /** Level of offense */
  readonly law_cat_cd: string;
  /** Offense description */
  readonly ofns_desc: string;
  /** Precinct code */
  readonly addr_pct_cd: string;
  /** Borough name */
  readonly boro_nm: string;
  /** Coordinates - latitude */
  readonly latitude: string;
  /** Coordinates - longitude */
  readonly longitude: string;
  /** Victim age group */
  readonly vic_age_group: string;
  /**  Victim race */
  readonly vic_race: string;
  /**  Victim sex */
  readonly vic_sex: string;
  /** Suspect age group */
  readonly susp_age_group: string;
  /** Suspect race */
  readonly susp_race: string;
  /** Suspect sex */
  readonly susp_sex: string;
}

/**
 * Request some data from the NYPD dataset.
 *
 * @param queryParams - The SoQL parameters request object which will be encoded in to the query parameters, see https://dev.socrata.com/docs/queries/
 * for more details.
 */
export async function requestData(queryParams: Record<string, string>): Promise<IComplaintDto[]> {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value);
  }

  // Append the token value if it exists.
  if (token) {
    url.searchParams.append('$$app_token', token);
  }

  const response = await fetch(url.href);
  if (response.status === 200) {
    return (await response.json()) as IComplaintDto[];
  } else {
    throw new Error(response.statusText);
  }
}
