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
  },
  semanticTypes: {
    properties: {
      /**
       * Abstract Text
       */
      AbstractText: "guid9A224CCF-28F7-4c55-9F14-9E820A0B1631", 

      /**
       * Address
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractText}
       */
      Address: "guid5E4B9174-E288-46c3-989F-B1F895C7DCDE", 

      /**
       * Park Name - The green location in which the event occurred
       *
       * Synonyms: Green Location Address
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.Address}
       */
      ParkName: "guid01d80371-1d48-4bc0-9727-91112ef79708", 

      /**
       * Patrol Borough - The patrol borough in which the incident occurred
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.Address}
       */
      PatrolBorough: "guid0b166672-2054-4023-82e7-d9ffb51720bf", 

      /**
       * Premises Type - The specific type of premises in which the incident occurred
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.Address}
       */
      PremisesType: "guid7a1fb141-a787-4a74-89e2-42eb5e8d1d22", 

      /**
       * Station Name - The name of the transit station in which the incident occurred
       *
       * Synonyms: Transit Station Name
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.Address}
       */
      StationName: "guid35d43af7-b2d9-4c37-b724-f2a2478b7d49", 

      /**
       * Age Range - The age group an individual is in
       *
       * Synonyms: Age Group
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractText}
       */
      AgeRange: "guid092fbb97-f213-4459-9249-d697a567ce6c", 

      /**
       * Crime Status - Status of a crime or an offence
       *
       * Synonyms: Offence Status
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractText}
       */
      CrimeStatus: "guida297f137-e0ec-4278-928c-3160110f0b8b", 

      /**
       * Abstract Number
       */
      AbstractNumber: "guid6D676796-915D-487f-B384-73503C988ABE", 

      /**
       * Associated Internal Classification Code - An associated code with a certain property
       *
       * Synonyms: Numbered Code
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      AssociatedInternalClassificationCode: "guid5c06ef4b-1a64-435c-99a1-14394ad7359a", 

      /**
       * Associated Jurisdiction Code - An associated code with a certain property
       *
       * Synonyms: Numbered Code
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      AssociatedJurisdictionCode: "guid7d4b0e0e-80d4-44de-b84f-d5541a2454e0", 

      /**
       * Associated Offence Classification Code - An associated code with a certain property
       *
       * Synonyms: Numbered Code
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      AssociatedOffenceClassificationCode: "guiddccfa76f-0f2d-4494-8934-d075e4f48271", 

      /**
       * Associated Precinct Code - An associated code with a certain property
       *
       * Synonyms: Numbered Code
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      AssociatedPrecinctCode: "guid144e2dcd-977e-441a-a793-b007e098f0f8", 

      /**
       * Associated Transit District Code - An associated code with a certain property
       *
       * Synonyms: Numbered Code
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      AssociatedTransitDistrictCode: "guid3688f878-a6d8-4a7f-b802-0eb102c795e5", 

      /**
       * Unique ID - Unique ID to identify a certain copy of an entity
       *
       * Synonyms: Number
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractNumber}
       */
      UniqueID: "guiddac50322-b7d0-4e2c-a96a-6494a6621c12", 

      /**
       * Abstract Flag
       */
      AbstractFlag: "guid74F2A516-2F49-4282-989F-F4A468656FF0", 

      /**
       * Is Domestic Violence - If true, the type of offense was domestic violence
       *
       * Base property: {@link nypdcomplaintdataschema.semanticTypes.properties.AbstractFlag}
       */
      IsDomesticViolence: "guidef394b85-9699-4d3f-ae39-ba6e9c0d8ba0", 
    } 
  }
} as const;
