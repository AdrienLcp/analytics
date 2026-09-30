/**
 * A single-page app changes the page through `history.pushState`, which fires
 * no event: the method is wrapped so the tracker hears it, and `popstate`
 * covers the back and forward buttons. `replaceState` is left alone — it
 * rewrites the current entry, it does not open a new page.
 */
export const onPathChange = (listener: () => void): void => {
  const pushState = history.pushState.bind(history)

  history.pushState = (...parameters) => {
    pushState(...parameters)
    listener()
  }

  addEventListener('popstate', listener)
}
