import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { routes } from '@/infrastructure/router/routes'
import { I18nProvider } from '@/presentation/i18n/i18n-provider'
import { applyInitialLocale } from '@/presentation/i18n/initial-locale'

import '@/presentation/styles/globals.sass'

const initialLocale = applyInitialLocale()

const container = document.getElementById('root')

if (container === null) {
  throw new Error('Missing #root in index.html')
}

const router = createBrowserRouter(routes)

createRoot(container).render(
  <StrictMode>
    <I18nProvider locale={initialLocale}>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>
)
