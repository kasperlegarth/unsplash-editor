/**
 * TextImage modul types
 * Udvider base module settings med modul-specifikke indstillinger
 */

import type { BaseModuleSettings } from '~/types/modules'

/**
 * Modul-specifik indstilling: Billede placering
 */
export type ImagePosition = 'left' | 'right'

/**
 * TextImage modul indstillinger
 * Arver fælles indstillinger + unikke indstillinger
 */
export interface TextImageSettings extends BaseModuleSettings {
  imagePosition: ImagePosition
  headline: string
  text: string
  imageUrl: string
}

/**
 * Default settings for TextImage modul
 */
export const defaultTextImageSettings: TextImageSettings = {
  backgroundColor: 'white',
  paddingTop: 'medium',
  paddingBottom: 'medium',
  imagePosition: 'right',
  headline: 'Din overskrift her',
  text: 'Din tekst her. Dette er et eksempel på hvordan tekst og billede kan kombineres i et modul.',
  imageUrl: 'https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?q=80&w=700'
}
