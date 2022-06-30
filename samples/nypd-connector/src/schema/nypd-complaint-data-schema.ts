/********* THIS IS AN AUTO GENERATED FILE *********/
/* eslint-disable */
import * as path from 'path';

// prettier-ignore
export const nypdcomplaintdataschema = {
  /** The path to the original schema file. */
  schemaPath: path.resolve(__dirname, "nypd-complaint-data-schema.xml"),
  /** The path to the original charting scheme file. */
  chartingSchemePath: path.resolve(__dirname, "nypd-complaint-data-schema-charting-schemes.xml"),
  entityTypes: {
    Complaint: {
      id: "ET1",
      isLink: false,
      propertyTypes: {
        "Complaint Number": { id: "PT1", logicalType: "singleLineString", },
        "Complaint Start Date": { id: "PT2", logicalType: "date", },
        "Complaint End Date": { id: "PT3", logicalType: "date", },
        "Complaint Start Time": { id: "PT4", logicalType: "time", },
        "Complaint End Time": { id: "PT5", logicalType: "time", },
        "Crime Status": { id: "PT6", logicalType: "suggestedFromList", possibleValues: [{"displayValue":"Completed","value":"Completed"},{"displayValue":"Attempted","value":"Attempted"}]},
        "Jurisdiction Code": { id: "PT7", logicalType: "integer", },
        "Jurisdiction Description": { id: "PT8", logicalType: "singleLineString", },
        "Offence Classification Code": { id: "PT9", logicalType: "integer", },
        "Level Of Offence": { id: "PT10", logicalType: "suggestedFromList", possibleValues: [{"displayValue":"Misdemeanor","value":"Misdemeanor"},{"displayValue":"Violation","value":"Violation"},{"displayValue":"Felony","value":"Felony"}]},
        "Offence Description": { id: "PT11", logicalType: "singleLineString", },
        "Internal Classification Code": { id: "PT12", logicalType: "integer", },
        "Classification Description": { id: "PT13", logicalType: "singleLineString", },
        "Date Reported": { id: "PT14", logicalType: "date", },
        "Location Of Occurrence": { id: "PT29", logicalType: "suggestedFromList", possibleValues: [{"displayValue":"Inside","value":"Inside"},{"displayValue":"Opposite Of","value":"Opposite Of"},{"displayValue":"Front Of","value":"Front Of"},{"displayValue":"Rear Of","value":"Rear Of"}]},
      }
    },
    Location: {
      id: "ET2",
      isLink: false,
      propertyTypes: {
        "Precinct Code": { id: "PT15", logicalType: "integer", },
        "Borough Name": { id: "PT16", logicalType: "singleLineString", },
        "Housing Development": { id: "PT17", logicalType: "singleLineString", },
        "Park Name": { id: "PT19", logicalType: "singleLineString", },
        "Patrol Borough": { id: "PT20", logicalType: "singleLineString", },
        "Premises Description": { id: "PT21", logicalType: "singleLineString", },
        "Station Name": { id: "PT22", logicalType: "singleLineString", },
        "Transit District": { id: "PT23", logicalType: "integer", },
        "Coordinates": { id: "PT18", logicalType: "geospatial", },
      }
    },
    Person: {
      id: "ET3",
      isLink: false,
      propertyTypes: {
        "Age Group": { id: "PT26", logicalType: "suggestedFromList", possibleValues: [{"displayValue":"<18","value":"<18"},{"displayValue":"18-24","value":"18-24"},{"displayValue":"25-44","value":"25-44"},{"displayValue":"45-64","value":"45-64"},{"displayValue":"65+","value":"65+"}]},
        "Race": { id: "PT27", logicalType: "singleLineString", },
        "Sex": { id: "PT28", logicalType: "suggestedFromList", possibleValues: [{"displayValue":"M","value":"M"},{"displayValue":"F","value":"F"},{"displayValue":"U","value":"U"}]},
      }
    },
    AnalystsNotebookChart: {
      id: "CHART",
      isLink: false,
      propertyTypes: {
        "Name": { id: "CHART1", logicalType: "singleLineString", },
        "Description": { id: "CHART2", logicalType: "multipleLineString", },
      }
    },
  },
  linkTypes: {
    Locatedat: {
      id: "LT1",
      isLink: true,
      propertyTypes: {

      }
    },
    Suspectof: {
      id: "LT2",
      isLink: true,
      propertyTypes: {

      }
    },
    Victimof: {
      id: "LT3",
      isLink: true,
      propertyTypes: {

      }
    },
  }
} as const;
