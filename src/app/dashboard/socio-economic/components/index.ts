// Export all socio-economic components and types
export { SocioEconomicModals } from './SocioEconomicModals'
export { SocioEconomicPageExample } from './SocioEconomicPageExample'
export { useSocioEconomicModals } from './useSocioEconomicModals'

// Export individual modal components
export { default as CreateEntryModal } from './CreateEntryModal'
export { default as UpdateEntryModal } from './UpdateEntryModal'
export { default as DetailsModal } from './DetailsModal'
export { default as DeleteConfirmationModal } from './DeleteConfirmationModal'

// Export utility components
export { default as SearchAndFilters } from './SearchAndFilters'
export { default as Pagination } from './Pagination'
export { default as SocioEconomicTabs } from './SocioEconomicTabs'

// Export types and configurations
export type { 
  SocioEconomicData, 
  ModalAction, 
  SocioEconomicType, 
  FieldConfig 
} from '@/lib/socio-economic/types'
export { SOCIO_ECONOMIC_CONFIGS } from '@/lib/socio-economic/types'

// Export conservation types for modals
export type { 
  ConservationData, 
  ConservationType 
} from '@/lib/conservation/types'
export { CONSERVATION_CONFIGS } from '@/lib/conservation/types'

