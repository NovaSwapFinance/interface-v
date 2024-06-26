import { t } from 'i18n'
import { Box } from 'nft/components/Box'
import { ReactNode } from 'react'

import * as styles from './NavIcon.css'

interface NavIconProps {
  children: ReactNode
  isActive?: boolean
  label?: string
  onClick: () => void
  activeBackground?: boolean
}

export const NavIcon = ({
  children,
  isActive,
  label = t`Navigation button`,
  onClick,
  activeBackground,
}: NavIconProps) => {
  return (
    <Box
      as="button"
      className={styles.navIcon}
      color={isActive ? 'neutral1' : 'neutral2'}
      onClick={onClick}
      height="40"
      width="40"
      aria-label={label}
      backgroundColor={activeBackground ? 'accent2' : 'transparent'}
    >
      {children}
    </Box>
  )
}
