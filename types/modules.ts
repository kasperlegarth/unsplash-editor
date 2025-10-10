/**
 * Global module types og interfaces
 * Definerer fælles indstillinger for alle moduler
 */

/**
 * Fælles baggrundsfarver tilgængelige for alle moduler
 */
export type BackgroundColor =
  | 'white'
  | 'light-gray'
  | 'gray'
  | 'dark-gray'
  | 'black'

/**
 * Fælles module indstillinger
 * Alle moduler arver fra denne base
 */
export interface BaseModuleSettings {
  backgroundColor: BackgroundColor
  paddingTop?: 'none' | 'small' | 'medium' | 'large'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large'
}

/**
 * Base module props interface
 */
export interface BaseModuleProps {
  settings: BaseModuleSettings
}
