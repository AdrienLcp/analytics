import type React from 'react'
import {
  type NavigateOptions,
  Outlet,
  ScrollRestoration,
  useHref,
  useNavigate
} from 'react-router'

import { prefersReducedMotion } from '@/infrastructure/browser'
import { AppShell } from '@/presentation/app-shell'
import { RouterProvider } from '@/presentation/components/router-provider'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

/** react-router resolves every href against the route; an external one stays as written. */
const useRouterHref = (href: string): string => {
  const routeHref = useHref(href)

  return URL.canParse(href) ? href : routeHref
}

/** Handed to `RouterProvider` from module scope: the React Compiler skips a component that passes a hook as a value. */
const hrefResolution = { useHref: useRouterHref }

/**
 * A navigation superseded by the next one rejects with `AbortError`: expected
 * control flow when the period is switched twice in a row, not a failure.
 */
const ignoreSupersededNavigation = (error: unknown): void => {
  if (error instanceof Error && error.name === 'AbortError') return

  throw error
}

export const RootRoute: React.FC = () => {
  const navigate = useNavigate()

  return (
    <RouterProvider
      navigate={(path, options) => {
        void Promise.resolve(
          navigate(path, {
            viewTransition: !prefersReducedMotion(),
            ...options
          })
        ).catch(ignoreSupersededNavigation)
      }}
      {...hrefResolution}
    >
      <AppShell>
        <Outlet />
      </AppShell>
      <ScrollRestoration />
    </RouterProvider>
  )
}
