import { BambooEntryData, WaterTanksEntryData, EUfundedEntryData, buffaloWallEntryData, TreeEntryData } from "@/lib/conservation/conservation";

// Utility: ensure valid Date and convert to ISO string
function toIso(dateLike: any): string {
  if (!dateLike) {
    throw new Error("Date is required");
  }
  
  // If it's already an ISO string, return it
  if (typeof dateLike === 'string' && dateLike.includes('T')) {
    return dateLike;
  }
  
  let d: Date;
  
  // Handle different date formats
  if (dateLike instanceof Date) {
    d = dateLike;
  } else if (typeof dateLike === 'string') {
    // Handle HTML date input format (YYYY-MM-DD) - convert to ISO
    if (dateLike.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // HTML date input format - create date at midnight UTC
      d = new Date(dateLike + 'T00:00:00.000Z');
    } else {
      // Try to parse as regular date string
      d = new Date(dateLike);
    }
  } else if (typeof dateLike === 'number') {
    // Handle timestamp
    d = new Date(dateLike);
  } else {
    throw new Error("Invalid date format");
  }
  
  // Validate the date
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date value");
  }
  
  return d.toISOString();
}

// Utility: ensure valid Date and convert to YYYY-MM-DD (date-only)
function toDateOnly(dateLike: any): string {
  if (!dateLike) {
    throw new Error("Date is required");
  }

  // If it's already YYYY-MM-DD, accept as-is
  if (typeof dateLike === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateLike)) {
    return dateLike;
  }

  let d: Date;
  if (dateLike instanceof Date) {
    d = dateLike;
  } else if (typeof dateLike === 'string') {
    // If it's full ISO, parse and then trim to date
    d = new Date(dateLike);
  } else if (typeof dateLike === 'number') {
    d = new Date(dateLike);
  } else {
    throw new Error("Invalid date format");
  }

  if (isNaN(d.getTime())) {
    throw new Error("Invalid date value");
  }

  return d.toISOString().split('T')[0];
}

// Tree Planting
export function treeFromBackend(e: any): TreeEntryData {
  return {
    id: String(e.id),
    treeType: e.treeType,
    location: e.location,
    numberOfTrees: Number(e.numberOfTrees),
    datePlanted: e.datePlanted ? new Date(e.datePlanted) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}

export function treeToBackend(e: TreeEntryData) {
  return {
    treeType: e.treeType,
    location: e.location,
    numberOfTrees: e.numberOfTrees,
    // Backend expects 'datePlanted' as YYYY-MM-DD
    datePlanted: toDateOnly(e.datePlanted),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// Bamboo
export function bambooFromBackend(e: any): BambooEntryData {
  return {
    id: String(e.id),
    distanceCovered: Number(e.distanceCovered),
    location: e.location,
    dateDonated: e.datePlanted ? new Date(e.datePlanted) : (e.dateDonated ? new Date(e.dateDonated) : new Date()),
    description: e.description || "",
  };
}

export function bambooToBackend(e: BambooEntryData) {
  return {
    distanceCovered: e.distanceCovered,
    location: e.location,
    datePlanted: toDateOnly(e.dateDonated),
    description: e.description || undefined,
  };
}

// Water Tanks
export function waterTanksFromBackend(e: any): WaterTanksEntryData {
  return {
    id: String(e.id),
    waterTankType: e.tankType,
    location: e.location,
    numberOfWaterTanks: Number(e.numberOfTanks),
    dateDonated: e.dateDonated ? new Date(e.dateDonated) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}

export function waterTanksToBackend(e: WaterTanksEntryData) {
  return {
    tankType: e.waterTankType,
    location: e.location,
    numberOfTanks: e.numberOfWaterTanks,
    dateDonated: toDateOnly(e.dateDonated),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// EU Funded Projects
export function euFundedFromBackend(e: any): EUfundedEntryData {
  return {
    id: String(e.id),
    district: e.district,
    location: e.location,
    treesPlanted: Number(e.numberOfTrees),
    datePlanted: e.datePlanted ? new Date(e.datePlanted) : new Date(),
    targetBeneficiaries: Number(e.targetBeneficiaries),
    currentBeneficiaries: Number(e.currentBeneficiaries),
    description: e.description || "",
  };
}

export function euFundedToBackend(e: EUfundedEntryData) {
  return {
    district: e.district,
    location: e.location,
    numberOfTrees: e.treesPlanted,
    datePlanted: toDateOnly(e.datePlanted),
    targetBeneficiaries: e.targetBeneficiaries,
    currentBeneficiaries: e.currentBeneficiaries,
    description: e.description || undefined,
  };
}

// Buffalo Wall
export function buffaloWallFromBackend(e: any): buffaloWallEntryData {
  return {
    id: String(e.id),
    dateRepaired: e.dateRepaired ? new Date(e.dateRepaired) : new Date(),
    cost: Number(e.cost),
  };
}

export function buffaloWallToBackend(e: buffaloWallEntryData) {
  return {
    dateRepaired: toDateOnly(e.dateRepaired),
    cost: e.cost,
  };
}

