interface LivestockEntryData {
    id: string;
    animalType: string;
    location: string;
    distributedAnimals: number;
    deaths: number;
    currentlyOwned: number;
    transferredAnimals: number;
    soldAnimals: number;
    dateDonated: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number; 
    description: string;
}

interface HousingMaterialsEntryData{
    id: string;
    materialType: string;
    distributedMaterials: number;
    location: string;
    dateDonated: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface HousingHousesEntryData{
    id: string;
    houseCategory: string;
    houseOwner: string;
    location: string;
    dateBuilt: Date;
    houseCondition: "Good" | "Bad";
    materials: string;
    description: string;
}

interface HousingRepairmentsEntryData{
    id: string;
    houseOwner: string;
    location: string;
    dateRepaired: Date;
    description: string;
}

interface HousingVillagesEntryData{
    id: string;
    villageName: string;
    location: string;
    totalHouses: number;
    dateBuilt: Date;
    goodCondition: number;
    badCondition: number;
    badConditionDescription: string;
    description: string;
}

interface HousingToiletsEntryData{
    id: string;
    toiletType: string;
    toiletsBuilt: number;
    location: string;
    dateDonated: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface empowermentTailoringEntryData{
    id: string;
    tailoringCenter: string;
    location: string;
    people: number;
    date: Date;
    trainingDuration: string;
    materials: string;
    description: string;
}

interface empowermentMicroFinanceEntryData{
    id: string;
    name: string;
    location: string;
    description: string;
}

interface educationMaterialsEntryData{
    id: string;
    materialType: string;
    location: string;
    distributedMaterials: number;
    dateDonated: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface educationInfrastructuresEntryData{
    id: string;
    schoolName: string;
    location: string;
    infrastructureType: "ECD" | "Nursery" | "Primary" | "Ordinary Level" | "Advanced Level" | "Vocational Training";
    dateDonated: Date;
    description: string;
}

interface educationStudentsEntryData{
    id: string;
    studentName: string;
    studentLocation: string;
    schoolName: string;
    schoolLocation: string;
    class: string;
    fundingYears: number;
    description: string;
}

interface healthCentresEntryData{
    id: string;
    healthCentreName: string;
    location: string;
    dateBuilt: Date;
    description: string;
}

interface officesEntryData{
    id: string;
    officeName: string;
    location: string;
    dateBuilt: Date;
    description: string;
}

interface sportsEntryData{
    id: string;
    sportName: "Basketball" | "Volleyball" | "Football" | "Tennis" | "Table Tennis" | "Badminton" | "Chess" | "Pool" | "Other";
    location: string;
    condition: "Good" | "Bad";
    dateBuilt: Date;
    description: string;
}

interface parkingEntryData{
    id: string;
    parkingName: string;
    carsSupported: number;
    location: string;
    dateBuilt: Date;
    description: string;
}

interface waterPumpsEntryData{
    id: string;
    pumpName: string;
    location: string;
    dateBuilt: Date;
    pumpCondition: "Good" | "Bad";
    description: string;
}

export type {
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
}
