interface TreeEntryData {
    id: string;
    treeType: string;
    location: string;
    numberOfTrees: number;
    datePlanted: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface WaterTanksEntryData {
    id: string;
    waterTankType: string;
    location: string;
    numberOfWaterTanks: number;
    dateDonated: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface BambooEntryData{
    id: string;
    distanceCovered: number;
    location: string;
    dateDonated: Date;
    description: string;
}

interface EUfundedEntryData {
    id: string;
    district: string;
    location: string;
    treesPlanted: number;
    datePlanted: Date;
    targetBeneficiaries: number;
    currentBeneficiaries: number;
    description: string;
}

interface buffaloWallEntryData{
    id: string;
    dateRepaired: Date;
    cost: number;
}

export type {TreeEntryData, WaterTanksEntryData, BambooEntryData, EUfundedEntryData, buffaloWallEntryData};


