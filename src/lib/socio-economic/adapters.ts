import {
  educationInfrastructuresEntryData,
  educationMaterialsEntryData,
  educationStudentsEntryData,
  healthCentresEntryData,
  sportsEntryData,
  officesEntryData,
  HousingMaterialsEntryData,
  HousingToiletsEntryData,
  HousingHousesEntryData,
  HousingRepairmentsEntryData,
  HousingVillagesEntryData,
  waterPumpsEntryData,
  parkingEntryData,
} from "@/lib/socio-economic/socio-economic";

// Education - Infrastructures
export function eduInfraFromBackend(e: any): educationInfrastructuresEntryData {
  return {
    id: String(e.id),
    schoolName: e.schoolName,
    location: e.location,
    infrastructureType: e.infrastructureType,
    dateDonated: e.dateDonated ? new Date(e.dateDonated) : new Date(),
    description: e.description || "",
  };
}
export function eduInfraToBackend(e: educationInfrastructuresEntryData) {
  return {
    schoolName: e.schoolName,
    location: e.location,
    infrastructureType: e.infrastructureType,
    dateDonated: e.dateDonated instanceof Date ? e.dateDonated.toISOString() : new Date(e.dateDonated as any).toISOString(),
    description: e.description || undefined,
  };
}

// Education - Materials
export function eduMaterialsFromBackend(e: any): educationMaterialsEntryData {
  return {
    id: String(e.id),
    materialType: e.materialType,
    location: e.location,
    distributedMaterials: Number(e.distributedMaterials),
    dateDonated: e.dateDonated ? new Date(e.dateDonated) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}
export function eduMaterialsToBackend(e: educationMaterialsEntryData) {
  return {
    materialType: e.materialType,
    location: e.location,
    distributedMaterials: e.distributedMaterials,
    dateDonated: e.dateDonated instanceof Date ? e.dateDonated.toISOString() : new Date(e.dateDonated as any).toISOString(),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// Education - Students
export function eduStudentsFromBackend(e: any): educationStudentsEntryData {
  return {
    id: String(e.id),
    studentName: e.studentName,
    studentLocation: e.studentLocation,
    schoolName: e.schoolName,
    schoolLocation: e.schoolLocation,
    class: e.class,
    fundingYears: Number(e.fundingYears),
    description: e.description || "",
  };
}
export function eduStudentsToBackend(e: educationStudentsEntryData) {
  return {
    studentName: e.studentName,
    studentLocation: e.studentLocation,
    schoolName: e.schoolName,
    schoolLocation: e.schoolLocation,
    class: e.class,
    fundingYears: e.fundingYears,
    description: e.description || undefined,
  };
}

// IT Training
export function itTrainingFromBackend(e: any) {
  return {
    id: String(e.id),
    name: e.name,
    location: e.location,
    numPeople: Number(e.numPeople),
    materials: e.materials || "",
    trainingDuration: e.trainingDuration != null ? Number(e.trainingDuration) : undefined,
    date: e.date ? new Date(e.date) : new Date(),
    description: e.description || "",
  };
}
export function itTrainingToBackend(e: any) {
  return {
    name: e.name,
    location: e.location,
    numPeople: e.numPeople,
    materials: e.materials || undefined,
    trainingDuration: e.trainingDuration,
    date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date as any).toISOString(),
    description: e.description || undefined,
  };
}

// Health Centres
export function healthCentreFromBackend(e: any): healthCentresEntryData {
  return {
    id: String(e.id),
    healthCentreName: e.healthCentreName,
    location: e.location,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    description: e.description || "",
  };
}
export function healthCentreToBackend(e: healthCentresEntryData) {
  return {
    healthCentreName: e.healthCentreName,
    location: e.location,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    description: e.description || undefined,
  };
}

// Sports
export function sportsFromBackend(e: any): sportsEntryData {
  return {
    id: String(e.id),
    sportName: e.sportName,
    location: e.location,
    condition: e.condition,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    description: e.description || "",
  };
}
export function sportsToBackend(e: sportsEntryData) {
  return {
    sportName: e.sportName,
    location: e.location,
    condition: e.condition,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    description: e.description || undefined,
  };
}

// Offices
export function officesFromBackend(e: any): officesEntryData {
  return {
    id: String(e.id),
    officeName: e.officeName,
    location: e.location,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    description: e.description || "",
  };
}
export function officesToBackend(e: officesEntryData) {
  return {
    officeName: e.officeName,
    location: e.location,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    description: e.description || undefined,
  };
}

// Housing - Materials
export function housingMaterialsFromBackend(e: any): HousingMaterialsEntryData {
  return {
    id: String(e.id),
    materialType: e.materialType,
    location: e.location,
    distributedMaterials: Number(e.distributedMaterials),
    dateDonated: e.dateDonated ? new Date(e.dateDonated) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}
export function housingMaterialsToBackend(e: HousingMaterialsEntryData) {
  return {
    materialType: e.materialType,
    location: e.location,
    distributedMaterials: e.distributedMaterials,
    dateDonated: e.dateDonated instanceof Date ? e.dateDonated.toISOString() : new Date(e.dateDonated as any).toISOString(),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// Housing - Toilets
export function housingToiletsFromBackend(e: any): HousingToiletsEntryData {
  return {
    id: String(e.id),
    toiletType: e.toiletType,
    toiletsBuilt: Number(e.toiletsBuilt),
    location: e.location,
    dateDonated: e.dateDonated ? new Date(e.dateDonated) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}
export function housingToiletsToBackend(e: HousingToiletsEntryData) {
  return {
    toiletType: e.toiletType,
    toiletsBuilt: e.toiletsBuilt,
    location: e.location,
    dateDonated: e.dateDonated instanceof Date ? e.dateDonated.toISOString() : new Date(e.dateDonated as any).toISOString(),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// Housing - Houses
export function housingHousesFromBackend(e: any): HousingHousesEntryData {
  return {
    id: String(e.id),
    houseCategory: e.houseCategory,
    houseOwner: e.houseOwner,
    location: e.location,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    houseCondition: e.houseCondition,
    materials: e.materials || "",
    description: e.description || "",
  };
}
export function housingHousesToBackend(e: HousingHousesEntryData) {
  return {
    houseCategory: e.houseCategory,
    houseOwner: e.houseOwner,
    location: e.location,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    houseCondition: e.houseCondition,
    materials: e.materials || undefined,
    description: e.description || undefined,
  };
}

// Housing - Repairments
export function housingRepairsFromBackend(e: any): HousingRepairmentsEntryData {
  return {
    id: String(e.id),
    houseOwner: e.houseOwner,
    location: e.location,
    dateRepaired: e.dateRepaired ? new Date(e.dateRepaired) : new Date(),
    description: e.description || "",
  };
}
export function housingRepairsToBackend(e: HousingRepairmentsEntryData) {
  return {
    houseOwner: e.houseOwner,
    location: e.location,
    dateRepaired: e.dateRepaired instanceof Date ? e.dateRepaired.toISOString() : new Date(e.dateRepaired as any).toISOString(),
    description: e.description || undefined,
  };
}

// Housing - Villages
export function housingVillagesFromBackend(e: any): HousingVillagesEntryData {
  return {
    id: String(e.id),
    villageName: e.villageName,
    location: e.location,
    totalHouses: Number(e.totalHouses),
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    goodCondition: Number(e.goodCondition),
    badCondition: Number(e.badCondition),
    badConditionDescription: e.badConditionDescription || "",
    description: e.description || "",
  };
}
export function housingVillagesToBackend(e: HousingVillagesEntryData) {
  return {
    villageName: e.villageName,
    location: e.location,
    totalHouses: e.totalHouses,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    goodCondition: e.goodCondition,
    badCondition: e.badCondition,
    badConditionDescription: e.badConditionDescription || undefined,
    description: e.description || undefined,
  };
}

// Water Pumps
export function waterPumpsFromBackend(e: any): waterPumpsEntryData {
  return {
    id: String(e.id),
    pumpName: e.pumpName,
    location: e.location,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    pumpCondition: e.pumpCondition,
    description: e.description || "",
  };
}
export function waterPumpsToBackend(e: waterPumpsEntryData) {
  return {
    pumpName: e.pumpName,
    location: e.location,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    pumpCondition: e.pumpCondition,
    description: e.description || undefined,
  };
}

// Parking
export function parkingFromBackend(e: any): parkingEntryData {
  return {
    id: String(e.id),
    parkingName: e.parkingName,
    carsSupported: Number(e.carsSupported),
    location: e.location,
    dateBuilt: e.dateBuilt ? new Date(e.dateBuilt) : new Date(),
    description: e.description || "",
  };
}
export function parkingToBackend(e: parkingEntryData) {
  return {
    parkingName: e.parkingName,
    carsSupported: e.carsSupported,
    location: e.location,
    dateBuilt: e.dateBuilt instanceof Date ? e.dateBuilt.toISOString() : new Date(e.dateBuilt as any).toISOString(),
    description: e.description || undefined,
  };
}

