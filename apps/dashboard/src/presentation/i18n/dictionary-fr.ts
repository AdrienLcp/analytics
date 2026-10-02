import { defineDictionary, defineTranslation } from '@adrienlcp/i18n'

const UTC = 'UTC'

export const FR_DICTIONARY = defineDictionary({
  breakdowns: {
    countries: 'Pays',
    country: defineTranslation('{code:displayname}', {
      displayname: { code: { type: 'region' } }
    }),
    devices: 'Appareils',
    language: defineTranslation('{code:displayname}', {
      displayname: { code: { type: 'language' } }
    }),
    lede: 'Chaque liste fait son total. Ce qui dépasse des lignes affichées est regroupé, jamais écarté.',
    locales: 'Langues',
    ofPageViews: defineTranslation('{count:plural}', {
      plural: {
        count: { one: 'sur {?} page vue', other: 'sur {?} pages vues' }
      }
    }),
    ofVisits: defineTranslation('{count:plural}', {
      plural: { count: { one: 'sur {?} visite', other: 'sur {?} visites' } }
    }),
    other: {
      countries: 'Autres ou inconnus',
      devices: 'Autres',
      locales: 'Autres ou inconnues',
      pages: 'Autres pages',
      referrers: 'Accès direct ou autres sites',
      themes: 'Autres'
    },
    pages: 'Pages les plus vues',
    referrers: 'Provenances',
    share: defineTranslation('{value:number}', {
      number: {
        value: {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
          style: 'percent'
        }
      }
    }),
    themes: 'Thèmes',
    title: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'D’où vient la seule page vue',
          other: 'D’où viennent les {?} pages vues'
        }
      }
    })
  },
  chart: {
    dayTick: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'short', timeZone: UTC } }
    }),
    endPageViews: 'pages vues',
    endVisits: 'visites',
    monthTick: defineTranslation('{month:date}', {
      date: { month: { month: 'short', timeZone: UTC } }
    }),
    summary: defineTranslation(
      'Graphique des pages vues et des visites {per:enum}, {range}. {pageViews:plural} et {visits:plural} au total. Les flèches gauche et droite lisent chaque {unit:enum}.',
      {
        enum: {
          per: { day: 'par jour', month: 'par mois' },
          unit: { day: 'jour', month: 'mois' }
        },
        plural: {
          pageViews: { one: '{?} page vue', other: '{?} pages vues' },
          visits: { one: '{?} visite', other: '{?} visites' }
        }
      }
    ),
    tick: '{value:number}',
    valueText: defineTranslation(
      '{bucket} : {pageViews:plural}, {visits:plural}',
      {
        plural: {
          pageViews: { one: '{?} page vue', other: '{?} pages vues' },
          visits: { one: '{?} visite', other: '{?} visites' }
        }
      }
    ),
    weekdayTick: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', timeZone: UTC, weekday: 'short' } }
    })
  },
  colophon: {
    definition:
      '<b>Une visite est une page vue qui arrive de l’extérieur du site.</b> Passer d’une page à l’autre du même site ajoute des pages vues, pas des visites. Rien sur cette page ne permet de distinguer deux visiteurs : pas de bandeau de consentement, il n’y a rien à consentir.',
    never: {
      cookie: 'Cookies',
      cookieNote: 'Aucun cookie n’est déposé, rien ne marque le navigateur.',
      fingerprint: 'Hash ou empreinte',
      fingerprintNote: 'Aucun identifiant n’est dérivé de quoi que ce soit.',
      ip: 'Adresse IP',
      ipNote: 'Ni stockée, ni journalisée.',
      query: 'Paramètres d’URL',
      queryNote: 'Jamais envoyés : le traceur ne lit que le chemin.',
      referrer: 'URL de provenance complète',
      referrerNote: 'Seul son domaine est gardé.',
      title: 'Jamais enregistré',
      userAgent: 'User agent',
      userAgentNote: 'Lu une fois pour écarter les robots, jamais gardé.'
    },
    recorded: {
      country: 'Pays',
      countryNote:
        'Déduit en bordure de réseau ; l’adresse d’origine est écartée.',
      device: 'Type d’appareil',
      deviceNote:
        'Lu dans la largeur de la fenêtre : mobile, tablette ou ordinateur.',
      language: 'Langue du navigateur',
      languageNote: 'fr-FR, en-US, de…',
      path: 'Chemin de la page',
      pathNote: 'Sans ses paramètres d’URL.',
      referrer: 'Domaine de provenance',
      referrerNote: 'linkedin.com, jamais le lien complet.',
      speed: 'Vitesse des pages',
      speedNote:
        'Trois mesures par chargement de page, ajoutées à un décompte par jour et jamais gardées visite par visite.',
      theme: 'Thème',
      themeNote: 'Clair ou sombre.',
      title: 'Enregistré à chaque page vue'
    },
    title: 'Ce qui est compté, et ce qui ne l’est jamais'
  },
  controls: {
    label: 'Réglages du tableau de bord',
    language: 'Langue',
    period: 'Période',
    site: 'Site'
  },
  credits: {
    busiest: defineTranslation('{unit:enum}', {
      enum: {
        unit: { day: 'Jour le plus chargé', month: 'Mois le plus chargé' }
      }
    }),
    busiestDay: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'short', timeZone: UTC } }
    }),
    busiestMonth: defineTranslation('{month:date}', {
      date: { month: { month: 'short', timeZone: UTC, year: 'numeric' } }
    }),
    busiestNote: defineTranslation('{count:plural}', {
      plural: { count: { one: '{?} page vue', other: '{?} pages vues' } }
    }),
    count: '{value:number}',
    label: 'Totaux',
    needsPageView: 'Attend une première page vue',
    needsVisit: 'Attend une première visite',
    noneYet: 'Aucune pour l’instant',
    notAvailable: 'Non disponible',
    pagesPerVisit: 'Pages par visite',
    pagesPerVisitNote: 'Pages vues ÷ visites',
    pagesPerVisitValue: defineTranslation('{value:number}', {
      number: {
        value: { maximumFractionDigits: 1, minimumFractionDigits: 1 }
      }
    }),
    pageViews: 'Pages vues',
    pageViewsNote: 'Chaque page ouverte',
    visits: 'Visites',
    visitsNote: 'Arrivées depuis l’extérieur du site'
  },
  empty: {
    bodyDays: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'Dès que le traceur sera sur {site}, chaque page vue arrivera ici en moins d’une minute : une ligne pour les pages vues, une pour les visites. Les listes ci-dessous se rempliront en même temps.',
          other:
            'Dès que le traceur sera sur {site}, chaque page vue arrivera ici en moins d’une minute : une ligne pour les pages vues, une pour les visites, sur {?} jours. Les listes ci-dessous se rempliront en même temps.'
        }
      }
    }),
    bodyMonths: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'Dès que le traceur sera sur {site}, chaque page vue arrivera ici en moins d’une minute : une barre pour les pages vues, une pour les visites. Les listes ci-dessous se rempliront en même temps.',
          other:
            'Dès que le traceur sera sur {site}, chaque page vue arrivera ici en moins d’une minute : une barre pour les pages vues, une pour les visites, sur {?} mois. Les listes ci-dessous se rempliront en même temps.'
        }
      }
    }),
    breakdownsLede:
      'Chacune fera son total, le reste regroupé en « autres ». Aucune ne peut isoler un visiteur.',
    breakdownsTitle: 'Ce que ces listes montreront',
    lede: 'Rien n’a encore été mesuré sur <b>{site}</b> sur {span}. Tant que le traceur n’y tourne pas, chaque chiffre ci-dessous est un zéro honnête.',
    pending: {
      countries: 'Déduits en bordure de réseau ; aucune adresse gardée.',
      locales: 'La langue que demande chaque navigateur.',
      pages: 'Les chemins ouverts, sans paramètres d’URL.',
      referrers: 'Les sites d’où arrivent les visites, par domaine.',
      themesAndDevices: 'Clair ou sombre ; mobile, tablette ou ordinateur.'
    },
    recorded: '0 enregistré',
    snippetLabel: 'Toute l’installation, une balise',
    themesAndDevices: 'Thèmes et appareils',
    title: 'Cette planche est encore vierge',
    waiting: 'En attente de la première page vue'
  },
  error: {
    body: defineTranslation('{reason:enum}', {
      enum: {
        reason: {
          invalid_response:
            'L’API a répondu, mais pas dans la forme que lit cette page. Recharger récupère la dernière version des deux.',
          unavailable:
            'L’API a répondu, mais n’a pas pu lire sa base pour l’instant. Les pages vues sont toujours comptées.',
          unreachable:
            'L’API est injoignable. Les pages vues sont toujours comptées ; seule cette page n’a pas pu les lire.'
        }
      }
    }),
    retry: 'Réessayer',
    screen: {
      description:
        'Quelque chose a échoué en dessinant le tableau de bord. Recharger suffit en général.',
      reload: 'Recharger',
      title: 'Cette page a cassé'
    },
    title: defineTranslation('{reason:enum}', {
      enum: {
        reason: {
          invalid_response: 'Les chiffres sont arrivés illisibles',
          unavailable: 'Les chiffres ne sont pas prêts',
          unreachable: 'Les chiffres ne sont pas arrivés'
        }
      }
    })
  },
  footer: {
    hosting: 'Compté sur un Worker Cloudflare, gardé dans D1',
    utc: 'Jours et mois en UTC'
  },
  head: {
    bucketing: defineTranslation('{unit:enum}', {
      enum: {
        unit: { day: 'Totaux par jour, UTC', month: 'Totaux par mois, UTC' }
      }
    }),
    lede: 'Pages vues et visites sur <b>{site}</b> sur {span}. Personne n’est identifié : aucun cookie, aucune adresse IP, aucun user agent n’est jamais stocké.'
  },
  loading: {
    body: 'Lecture des chiffres de {site}.',
    title: 'Mise en page de la planche'
  },
  masthead: {
    name: 'Analytics',
    owner: 'Les sites d’Adrien Lacourpaille',
    skip: 'Aller aux chiffres',
    source: 'Code source, AGPL'
  },
  notFound: {
    back: 'Ouvrir la planche {site}',
    body: '{path} n’est pas une page de ce tableau de bord.',
    title: 'Aucune planche à cette adresse'
  },
  period: {
    long: defineTranslation('{period:enum}', {
      enum: {
        period: { '7d': '7 jours', '12m': '12 mois', '30d': '30 jours' }
      }
    }),
    short: defineTranslation('{period:enum}', {
      enum: { period: { '7d': '7 J', '12m': '12 M', '30d': '30 J' } }
    }),
    span: defineTranslation('{period:enum}', {
      enum: {
        period: {
          '7d': 'les 7 derniers jours',
          '12m': 'les 12 derniers mois',
          '30d': 'les 30 derniers jours'
        }
      }
    })
  },
  plate: {
    stamp: 'aucun cookie · aucune donnée personnelle · ',
    title: defineTranslation('{unit:enum}', {
      enum: {
        unit: {
          day: 'Pages vues et visites, par jour',
          month: 'Pages vues et visites, par mois'
        }
      }
    })
  },
  range: {
    days: defineTranslation('{from:date} – {to:date}', {
      date: {
        from: { day: 'numeric', month: 'short', timeZone: UTC },
        to: { day: 'numeric', month: 'short', timeZone: UTC, year: 'numeric' }
      }
    }),
    months: defineTranslation('{from:date} – {to:date}', {
      date: {
        from: { month: 'short', timeZone: UTC, year: 'numeric' },
        to: { month: 'short', timeZone: UTC, year: 'numeric' }
      }
    })
  },
  speed: {
    abbr: defineTranslation('{metric:enum}', {
      enum: { metric: { cls: 'CLS', inp: 'INP', lcp: 'LCP' } }
    }),
    label: 'Vitesse des pages',
    lede: 'Mesuré par les navigateurs des visiteurs au moment de quitter une page, et lu à la valeur sous laquelle restent trois chargements sur quatre.',
    ledeEmpty:
      'Les navigateurs envoient ces mesures quand un visiteur quitte une page. Aucun ne l’a encore fait pour ce site sur la période.',
    name: defineTranslation('{metric:enum}', {
      enum: {
        metric: {
          cls: 'Décalage de mise en page',
          inp: 'Réponse aux interactions',
          lcp: 'Plus grand affichage'
        }
      }
    }),
    note: defineTranslation(
      '{question}, pour trois chargements sur quatre. D’après <b>{samples:plural}</b>.',
      {
        plural: {
          samples: {
            one: '{?} chargement de page',
            other: '{?} chargements de page'
          }
        }
      }
    ),
    noteEmpty: '{question}. Aucun navigateur ne l’a encore mesuré.',
    question: defineTranslation('{metric:enum}', {
      enum: {
        metric: {
          cls: 'De combien la page a bougé pendant son chargement',
          inp: 'Combien de temps un appui ou un clic a attendu la réponse de la page',
          lcp: 'Combien de temps avant que le contenu principal s’affiche'
        }
      }
    }),
    tick: {
      cls: '{value:number}',
      inp: '{value:number} ms',
      lcp: '{value:number} s'
    },
    title: 'La vitesse ressentie',
    value: {
      cls: defineTranslation('{value:number}', {
        number: {
          value: { maximumFractionDigits: 2, minimumFractionDigits: 2 }
        }
      }),
      inp: defineTranslation('{value:number} ms', {
        number: { value: { maximumFractionDigits: 0 } }
      }),
      lcp: defineTranslation('{value:number} s', {
        number: {
          value: { maximumFractionDigits: 1, minimumFractionDigits: 1 }
        }
      })
    },
    verdict: defineTranslation('{rating:enum}', {
      enum: {
        rating: {
          good: 'Bon',
          'needs-improvement': 'À améliorer',
          poor: 'Mauvais'
        }
      }
    }),
    verdictEmpty: 'Pas encore mesuré'
  },
  table: {
    caption: 'Pages vues et visites, {range}',
    day: defineTranslation('{day:date}', {
      date: {
        day: {
          day: 'numeric',
          month: 'short',
          timeZone: UTC,
          weekday: 'short',
          year: 'numeric'
        }
      }
    }),
    month: defineTranslation('{month:date}', {
      date: { month: { month: 'long', timeZone: UTC, year: 'numeric' } }
    }),
    toggle: 'Voir en tableau',
    unit: defineTranslation('{unit:enum}', {
      enum: { unit: { day: 'Jour', month: 'Mois' } }
    })
  },
  values: {
    device: defineTranslation('{device:enum}', {
      enum: {
        device: { desktop: 'Ordinateur', mobile: 'Mobile', tablet: 'Tablette' }
      }
    }),
    theme: defineTranslation('{theme:enum}', {
      enum: { theme: { dark: 'Sombre', light: 'Clair' } }
    })
  }
})
