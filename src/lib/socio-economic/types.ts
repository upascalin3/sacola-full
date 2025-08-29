import {
  LivestockEntryData,
  HousingMaterialsEntryData,
  HousingHousesEntryData,
  HousingRepairmentsEntryData,
  HousingVillagesEntryData,
  HousingToiletsEntryData,
  empowermentTailoringEntryData,
  empowermentMicroFinanceEntryData,
  educationMaterialsEntryData,
  educationInfrastructuresEntryData,
  educationStudentsEntryData,
  healthCentresEntryData,
  officesEntryData,
  sportsEntryData,
  parkingEntryData,
  waterPumpsEntryData,
  itTrainingEntryData,
  workersEntryData,
} from "@/lib/socio-economic/socio-economic";

// Union type for all socio-economic interfaces
export type SocioEconomicData =
  | LivestockEntryData
  | HousingMaterialsEntryData
  | HousingHousesEntryData
  | HousingRepairmentsEntryData
  | HousingVillagesEntryData
  | HousingToiletsEntryData
  | empowermentTailoringEntryData
  | empowermentMicroFinanceEntryData
  | educationMaterialsEntryData
  | educationInfrastructuresEntryData
  | educationStudentsEntryData
  | itTrainingEntryData
  | healthCentresEntryData
  | officesEntryData
  | sportsEntryData
  | parkingEntryData
  | waterPumpsEntryData
  | workersEntryData;

// Modal action types
export type ModalAction = "create" | "update" | "delete" | "details";

// Socio-economic type identifier
export type SocioEconomicType =
  | "livestock"
  | "housingMaterials"
  | "housingHouses"
  | "housingRepairments"
  | "housingVillages"
  | "housingToilets"
  | "empowermentTailoring"
  | "empowermentMicroFinance"
  | "educationMaterials"
  | "educationInfrastructures"
  | "educationStudents"
  | "itTraining"
  | "healthCentres"
  | "offices"
  | "sports"
  | "parking"
  | "waterPumps"
  | "workers";

// Field configuration for dynamic form generation
export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

// Socio-economic type configurations
export const SOCIO_ECONOMIC_CONFIGS: Record<
  SocioEconomicType,
  {
    title: string;
    fields: FieldConfig[];
  }
> = {
  livestock: {
    title: "Livestock",
    fields: [
      { key: "animalType", label: "Animal Type", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "distributedAnimals",
        label: "Distributed Animals",
        type: "number",
        required: true,
      },
      { key: "deaths", label: "Deaths", type: "number", required: true },
      {
        key: "born",
        label: "Born",
        type: "number",
        required: true,
      },
      {
        key: "transferredAnimals",
        label: "Transferred Animals",
        type: "number",
        required: true,
      },
      {
        key: "soldAnimals",
        label: "Sold Animals",
        type: "number",
        required: true,
      },
      {
        key: "dateDonated",
        label: "Date Donated",
        type: "date",
        required: true,
      },
      {
        key: "targetBeneficiaries",
        label: "Target Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "currentBeneficiaries",
        label: "Current Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  housingMaterials: {
    title: "Housing Materials",
    fields: [
      {
        key: "materialType",
        label: "Material Type",
        type: "text",
        required: true,
      },
      {
        key: "distributedMaterials",
        label: "Distributed Materials",
        type: "number",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "dateDonated",
        label: "Date Donated",
        type: "date",
        required: true,
      },
      {
        key: "targetBeneficiaries",
        label: "Target Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "currentBeneficiaries",
        label: "Current Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  housingHouses: {
    title: "Houses",
    fields: [
      {
        key: "houseCategory",
        label: "House Category",
        type: "select",
        required: true,
        options: ["1994 Genocide Survivor", "Vulnerable"],
      },
      { key: "houseOwner", label: "House Owner", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "houseCondition",
        label: "House Condition",
        type: "select",
        required: true,
        options: ["Good", "Bad"],
      },
      { key: "materials", label: "Materials", type: "text", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  housingRepairments: {
    title: "Housing Repairments",
    fields: [
      { key: "houseOwner", label: "House Owner", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "dateRepaired",
        label: "Date Repaired",
        type: "date",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  housingVillages: {
    title: "Housing Villages",
    fields: [
      {
        key: "villageName",
        label: "Village Name",
        type: "text",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      // totalHouses is computed as goodCondition + badCondition; no direct input
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "goodCondition",
        label: "Good Condition",
        type: "number",
        required: true,
      },
      {
        key: "badCondition",
        label: "Bad Condition",
        type: "number",
        required: true,
      },
      {
        key: "badConditionDescription",
        label: "Bad Condition Description",
        type: "textarea",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  housingToilets: {
    title: "Housing Toilets",
    fields: [
      { key: "toiletType", label: "Toilet Type", type: "text", required: true },
      {
        key: "toiletsBuilt",
        label: "Toilets Built",
        type: "number",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "dateDonated",
        label: "Date Donated",
        type: "date",
        required: true,
      },
      {
        key: "targetBeneficiaries",
        label: "Target Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "currentBeneficiaries",
        label: "Current Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  empowermentTailoring: {
    title: "Empowerment Tailoring",
    fields: [
      {
        key: "tailoringCenter",
        label: "Tailoring Center",
        type: "text",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "people", label: "People", type: "number", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      {
        key: "trainingDuration",
        label: "Training Duration (months)",
        type: "number",
        required: true,
      },
      { key: "materials", label: "Materials", type: "text", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  empowermentMicroFinance: {
    title: "Empowerment Micro Finance",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  educationMaterials: {
    title: "Education Materials",
    fields: [
      {
        key: "materialType",
        label: "Material Type",
        type: "text",
        required: true,
      },
      { key: "schoolName", label: "School Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "distributedMaterials",
        label: "Distributed Materials",
        type: "number",
        required: true,
      },
      {
        key: "dateDonated",
        label: "Date Donated",
        type: "date",
        required: true,
      },
      {
        key: "targetBeneficiaries",
        label: "Target Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "currentBeneficiaries",
        label: "Current Beneficiaries",
        type: "number",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  educationInfrastructures: {
    title: "Education Infrastructures",
    fields: [
      { key: "schoolName", label: "School Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "infrastructureType",
        label: "Infrastructure Type",
        type: "select",
        required: true,
        options: [
          "ECD",
          "Nursery",
          "Primary",
          "Ordinary Level",
          "Advanced Level",
          "Vocational Training",
        ],
      },
      {
        key: "dateDonated",
        label: "Date Donated",
        type: "date",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  educationStudents: {
    title: "Education Students",
    fields: [
      {
        key: "studentName",
        label: "Student Name",
        type: "text",
        required: true,
      },
      {
        key: "studentLocation",
        label: "Student Location",
        type: "text",
        required: true,
      },
      { key: "schoolName", label: "School Name", type: "text", required: true },
      {
        key: "schoolLocation",
        label: "School Location",
        type: "text",
        required: true,
      },
      { key: "class", label: "Class", type: "text", required: true },
      {
        key: "fundingYears",
        label: "Funding Years",
        type: "number",
        required: true,
      },
      {
        key: "date",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  itTraining: {
    title: "IT Training",
    fields: [
      { key: "name", label: "Training Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "numPeople",
        label: "People Trained",
        type: "number",
        required: true,
      },
      { key: "materials", label: "Materials", type: "text" },
      {
        key: "trainingDuration",
        label: "Training Duration (days)",
        type: "number",
      },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  healthCentres: {
    title: "Health Centres",
    fields: [
      {
        key: "healthCentreName",
        label: "Health Centre Name",
        type: "text",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  offices: {
    title: "Offices",
    fields: [
      { key: "officeName", label: "Office Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "dateBuilt",
        label: "Date Built",
        type: "date",
        required: true,
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  sports: {
    title: "Sports",
    fields: [
      {
        key: "sportName",
        label: "Sport Name",
        type: "select",
        required: true,
        options: [
          "Basketball",
          "Volleyball",
          "Football",
          "Tennis",
          "Table Tennis",
          "Badminton",
          "Chess",
          "Pool",
          "Other",
        ],
      },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["Good", "Bad"],
      },
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  parking: {
    title: "Parking",
    fields: [
      {
        key: "parkingName",
        label: "Parking Name",
        type: "text",
        required: true,
      },
      {
        key: "carsSupported",
        label: "Cars Supported",
        type: "number",
        required: true,
      },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  waterPumps: {
    title: "Water Pumps",
    fields: [
      { key: "pumpName", label: "Pump Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "dateBuilt", label: "Date Built", type: "date", required: true },
      {
        key: "pumpCondition",
        label: "Pump Condition",
        type: "select",
        required: true,
        options: ["Good", "Bad"],
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
    ],
  },
  workers: {
    title: "Workers",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["full-time", "part-time", "volunteers"],
      },
      {
        key: "dateEmployed",
        label: "Date Employed",
        type: "date",
        required: true,
      },
    ],
  },
};
