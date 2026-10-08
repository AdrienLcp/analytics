interface FontFaceSource {
  prop: string
  value: string
}

interface CompiledStylesheet {
  walkAtRules: (
    name: string,
    callback: (rule: {
      walkDecls: (
        prop: string,
        callback: (declaration: FontFaceSource) => void
      ) => void
    }) => void
  ) => void
}

const ARIAL_SOURCE = /^local\((["']?)Arial\1\)$/

/** The fonts drawn to Arial's metrics, so Linux and Android find one of them. */
const ARIAL_AND_ITS_METRIC_TWINS = [
  'Arial',
  'Liberation Sans',
  'Arimo',
  'Roboto'
]
  .map((family) => `local("${family}")`)
  .join(', ')

/**
 * Fontaine scales its fallback face from Arial alone, which Linux lacks and
 * Android replaces with Roboto: there the fallback fails to load and the swap
 * moves every line. Runs after fontaine and lists Arial's metric twins in its
 * place.
 */
export const arialMetricTwins = {
  OnceExit: (stylesheet: CompiledStylesheet): void => {
    stylesheet.walkAtRules('font-face', (rule) => {
      rule.walkDecls('src', (declaration) => {
        if (ARIAL_SOURCE.test(declaration.value)) {
          declaration.value = ARIAL_AND_ITS_METRIC_TWINS
        }
      })
    })
  },
  postcssPlugin: 'arial-metric-twins'
}
