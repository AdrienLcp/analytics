import type React from 'react'

import { Masthead } from './masthead'
import { PrivacyColophon } from './privacy-colophon'
import { SiteFooter } from './site-footer'
import { TokenBar } from './token-bar'

import './app-shell.sass'

type AppShellProps = {
  /** The page, rendered in its own `<Main>`. */
  children: React.ReactNode
}

/**
 * The chrome every page sits in. The token bar is a direct child of the shell
 * rather than of the page, so it stays stuck to the top all the way down to
 * the colophon instead of leaving with the page's last section.
 */
export const AppShell: React.FC<AppShellProps> = ({ children }) => (
  <div className='app-shell'>
    <Masthead />
    <TokenBar />
    {children}
    <PrivacyColophon />
    <SiteFooter />
  </div>
)
