/********* THIS IS AN AUTO GENERATED FILE *********/
/* eslint-disable */
import * as path from 'path';

// prettier-ignore
export const schema = {
  /** The path to the original schema file. */
  schemaPath: path.resolve(__dirname, "schema.xml"),
  /** The path to the original charting scheme file. */
  chartingSchemePath: path.resolve(__dirname, "schema-charting-schemes.xml"),
  entityTypes: {
    Person: {
      id: "Person",
      isLink: false,
      propertyTypes: {
        "First Name": { id: "PER1", logicalType: "singleLineString", },
        "Middle Name": { id: "PER2", logicalType: "singleLineString", },
        "Last Name": { id: "PER3", logicalType: "singleLineString", },
        "Year of Birth": { id: "PER4", logicalType: "date", },
        "Age": { id: "PER5", logicalType: "integer", },
        "SSN": { id: "PER6", logicalType: "singleLineString", },
        "SSN Issued Date and Time": { id: "PER7", logicalType: "dateAndTime", },
      }
    },
    Tweet: {
      id: "TWEET",
      isLink: false,
      propertyTypes: {
        "Contents": { id: "TW1", logicalType: "singleLineString", },
        "User name": { id: "TW2", logicalType: "singleLineString", },
        "Length": { id: "TW3", logicalType: "integer", },
      }
    },
    Address: {
      id: "Address",
      isLink: false,
      propertyTypes: {
        "First line": { id: "ADD1", logicalType: "singleLineString", },
        "Postcode": { id: "ADD2", logicalType: "singleLineString", },
        "Coordinates": { id: "ADD3", logicalType: "geospatial", },
      }
    },
  },
  linkTypes: {
    Friendswith: {
      id: "FriendLink",
      isLink: true,
      propertyTypes: {

      }
    },
  }
} as const;
