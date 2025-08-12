import { 
  TreeEntryData, 
  WaterTanksEntryData, 
  BambooEntryData, 
  EUfundedEntryData, 
  buffaloWallEntryData 
} from "@/lib/conservation/conservation"

// Union type for all conservation interfaces
export type ConservationData = 
  | TreeEntryData 
  | WaterTanksEntryData 
  | BambooEntryData 
  | EUfundedEntryData 
  | buffaloWallEntryData

// Modal action types
export type ModalAction = 'create' | 'update' | 'delete' | 'details'

// Conservation type identifier
export type ConservationType = 
  | 'tree' 
  | 'waterTanks' 
  | 'bamboo' 
  | 'euFunded' 
  | 'buffaloWall'

// Field configuration for dynamic form generation
export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'textarea'
  required?: boolean
  placeholder?: string
}

// Conservation type configurations
export const CONSERVATION_CONFIGS: Record<ConservationType, {
  title: string
  fields: FieldConfig[]
}> = {
  tree: {
    title: 'Tree Planting',
    fields: [
      { key: 'treeType', label: 'Tree Type', type: 'text', required: true, placeholder: 'Enter tree type' },
      { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
      { key: 'numberOfTrees', label: 'Number of Trees', type: 'number', required: true, placeholder: 'Enter number of trees' },
      { key: 'datePlanted', label: 'Date Planted', type: 'date', required: true },
      { key: 'targetBeneficiaries', label: 'Target Beneficiaries', type: 'number', required: true, placeholder: 'Enter target beneficiaries' },
      { key: 'currentBeneficiaries', label: 'Current Beneficiaries', type: 'number', required: true, placeholder: 'Enter current beneficiaries' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter description' }
    ]
  },
  waterTanks: {
    title: 'Water Tanks',
    fields: [
      { key: 'waterTankType', label: 'Water Tank Type', type: 'text', required: true, placeholder: 'Enter water tank type' },
      { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
      { key: 'numberOfWaterTanks', label: 'Number of Water Tanks', type: 'number', required: true, placeholder: 'Enter number of water tanks' },
      { key: 'dateDonated', label: 'Date Donated', type: 'date', required: true },
      { key: 'targetBeneficiaries', label: 'Target Beneficiaries', type: 'number', required: true, placeholder: 'Enter target beneficiaries' },
      { key: 'currentBeneficiaries', label: 'Current Beneficiaries', type: 'number', required: true, placeholder: 'Enter current beneficiaries' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter description' }
    ]
  },
  bamboo: {
    title: 'Bamboo',
    fields: [
      { key: 'distanceCovered', label: 'Distance Covered (m)', type: 'number', required: true, placeholder: 'Enter distance covered' },
      { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
      { key: 'dateDonated', label: 'Date Donated', type: 'date', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter description' }
    ]
  },
  euFunded: {
    title: 'EU-funded Project',
    fields: [
      { key: 'district', label: 'District', type: 'text', required: true, placeholder: 'Enter district' },
      { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
      { key: 'treesPlanted', label: 'Trees Planted', type: 'number', required: true, placeholder: 'Enter number of trees planted' },
      { key: 'datePlanted', label: 'Date Planted', type: 'date', required: true },
      { key: 'targetBeneficiaries', label: 'Target Beneficiaries', type: 'number', required: true, placeholder: 'Enter target beneficiaries' },
      { key: 'currentBeneficiaries', label: 'Current Beneficiaries', type: 'number', required: true, placeholder: 'Enter current beneficiaries' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter description' }
    ]
  },
  buffaloWall: {
    title: 'Buffalo Wall',
    fields: [
      { key: 'dateRepaired', label: 'Date Repaired', type: 'date', required: true },
      { key: 'cost', label: 'Cost', type: 'number', required: true, placeholder: 'Enter cost' }
    ]
  }
}
