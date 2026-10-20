#!/usr/bin/env python3
"""Génère la page /cas-clients et les 15 pages /cas-clients/<slug>.

Usage : python3 cas-clients/_generer.py   (depuis le dossier elements-communs)

Les textes viennent mot pour mot du document de la cliente (« Document de référence
pour la conception de la future page Cas clients »). Seules adaptations : apostrophes
typographiques, séparateurs des lignes de métadonnées remplacés par des virgules,
graphie « Scoaché » et « Biborg ». Les 15 cas sont présentés au même niveau.
Échelle, chiffre clé, photos et cas proches : Figma F329a0sXQJxBKyrLljpb2F, pages 07 à 22.
"""
import html
import json
import os
import struct

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DONNEES = json.loads(r'''[
 {
  "slug": "chanel",
  "nom": "CHANEL",
  "echelle": "individuel",
  "kpi": null,
  "titre": "Renforcer l’influence d’une dirigeante dans des interactions à forts enjeux",
  "meta": [
   "Dirigeante senior",
   "Coaching individuel",
   "Accompagnement en cours"
  ],
  "resume": "Dans un environnement à haut niveau d’exigence, une dirigeante senior souhaitait renforcer sa capacité à tenir pleinement sa position et à exercer son influence dans des interactions sensibles avec ses pairs et sa hiérarchie.",
  "situation": "Dans un environnement à haut niveau d’exigence, une dirigeante senior souhaitait renforcer sa capacité à tenir pleinement sa position et à exercer son influence dans des interactions sensibles avec ses pairs et sa hiérarchie. L’enjeu était de gagner en solidité et en impact sans tomber dans la sur-adaptation ni dans la confrontation.",
  "enjeux": [
   "S’affirmer dans le désaccord sans fragiliser la relation.",
   "Rester stable lorsque sa contribution ou sa légitimité sont challengées.",
   "Renforcer sa présence et son impact auprès de parties prenantes exigeantes.",
   "Développer une influence plus assumée, sans perdre en discernement ni en finesse relationnelle."
  ],
  "etapes": [
   [
    "Posture exécutive",
    "Consolider la légitimité, la présence et la capacité à tenir sa position dans des interactions à forts enjeux."
   ],
   [
    "Assertivité",
    "Exprimer plus clairement ses convictions et ses désaccords sans basculer dans la confrontation."
   ],
   [
    "Influence relationnelle",
    "Lire les dynamiques de pouvoir et adapter son mode d’influence aux interlocuteurs et aux situations."
   ],
   [
    "Sécurité intérieure",
    "Réduire la déstabilisation provoquée par certaines interactions afin de préserver discernement et capacité d’action."
   ]
  ],
  "evolutions": "Les premières évolutions observées font apparaître une posture plus solide et plus assurée, une moindre déstabilisation dans les interactions sensibles et un signal de leadership perçu comme plus fort et plus apaisé par certains collaborateurs. L’accompagnement est toujours en cours.",
  "demontre": "La capacité de Scoaché à accompagner une dirigeante senior lorsque l’enjeu n’est plus de développer une compétence isolée, mais de renforcer sa capacité à tenir sa place, influencer et décider dans des environnements sensibles.",
  "proches": [
   "vinci-airports",
   "michael-page",
   "ilek"
  ]
 },
 {
  "slug": "vinci-airports",
  "nom": "VINCI Airports",
  "echelle": "individuel",
  "kpi": null,
  "titre": "Prendre pleinement sa place de leader dans un environnement à forts enjeux stratégiques",
  "meta": [
   "Dirigeant senior",
   "Executive coaching",
   "Accompagnement en cours"
  ],
  "resume": "Dans un environnement international à forts enjeux stratégiques, un dirigeant senior souhaitait prendre davantage de hauteur et contribuer plus pleinement au niveau exécutif.",
  "situation": "Dans un environnement international à forts enjeux stratégiques, un dirigeant senior souhaitait prendre davantage de hauteur et contribuer plus pleinement au niveau exécutif. L’enjeu consistait à faire évoluer sa posture d’une forte implication opérationnelle vers davantage de contribution stratégique, d’influence et de leadership collectif.",
  "enjeux": [
   "Contribuer plus activement aux échanges de niveau exécutif.",
   "Exprimer davantage sa vision et ses convictions.",
   "Renforcer une posture plus stratégique et plus assertive.",
   "Déléguer davantage l’opérationnel pour concentrer son attention sur les sujets à forte valeur.",
   "Accroître son impact et sa capacité d’influence."
  ],
  "etapes": [
   [
    "Posture exécutive",
    "Clarifier ce qui est attendu à ce niveau de responsabilité et consolider la présence du dirigeant dans les espaces de décision."
   ],
   [
    "Contribution stratégique",
    "Faire évoluer l’allocation du temps et de l’attention vers les sujets à plus forte valeur stratégique."
   ],
   [
    "Influence et communication",
    "Renforcer la capacité à porter une vision, prendre position et contribuer de manière plus visible."
   ],
   [
    "Délégation",
    "Créer les conditions permettant de sortir progressivement de certains sujets opérationnels."
   ]
  ],
  "evolutions": "Les indicateurs de progression portent notamment sur la contribution aux échanges exécutifs, la délégation des sujets opérationnels, l’impact, l’influence et la posture stratégique. L’accompagnement est en cours ; aucun résultat final n’est donc revendiqué à ce stade.",
  "demontre": "La capacité de Scoaché à accompagner le passage d’une posture de contribution principalement opérationnelle à une posture de leadership plus stratégique, plus visible et plus influente.",
  "proches": [
   "chanel",
   "michael-page",
   "ilek"
  ]
 },
 {
  "slug": "mazars",
  "nom": "Mazars",
  "echelle": "collectif",
  "kpi": [
   "27",
   "nouveaux associés"
  ],
  "titre": "Accompagner le passage à un nouveau rôle de leadership",
  "meta": [
   "27 nouveaux associés France",
   "4 groupes",
   "Parcours de leadership sur 6 mois"
  ],
  "resume": "L’accession au rôle d’associé constitue un véritable passage de seuil : l’expertise qui a permis d’être promu ne suffit plus.",
  "situation": "L’accession au rôle d’associé constitue un véritable passage de seuil : l’expertise qui a permis d’être promu ne suffit plus. Il faut désormais prendre sa place parmi des pairs seniors, porter une position, fédérer des équipes et exercer une responsabilité élargie.",
  "enjeux": [
   "Prendre la parole et se positionner au-delà de son expertise.",
   "Trouver sa place auprès d’associés plus expérimentés.",
   "Tenir des situations relationnelles ou managériales complexes.",
   "Impliquer les équipes et faire évoluer sa manière d’exercer le leadership.",
   "Passer d’une logique de performance individuelle à une contribution plus large à l’organisation."
  ],
  "etapes": [
   [
    "Parcours collectif",
    "Quatre groupes de pairs accompagnés pendant six mois autour de situations réelles de leadership."
   ],
   [
    "Plénières",
    "Des temps collectifs de lancement, de point d’étape et de clôture pour créer un cadre partagé."
   ],
   [
    "Travail individualisé",
    "Des échanges en amont et en aval pour ancrer les objectifs et les apprentissages."
   ],
   [
    "Mise en pratique",
    "Assertivité, communication sensible, reconnaissance, ouverture, inclusion et sécurité psychologique travaillées à partir des situations rencontrées."
   ]
  ],
  "evolutions": "Les participants ont progressivement davantage pris position au-delà de leur expertise, impliqué leurs équipes, installé de nouveaux rituels, exprimé plus directement désaccords et reconnaissance et ajusté leur posture. La qualité des échanges entre pairs s’est également renforcée.",
  "demontre": "La capacité de Scoaché à sécuriser un passage de seuil collectif vers un niveau de responsabilité plus élevé, sans standardiser les trajectoires individuelles.",
  "proches": [
   "cic",
   "croix-rouge-francaise",
   "chanel"
  ]
 },
 {
  "slug": "cic",
  "nom": "CIC",
  "echelle": "collectif",
  "kpi": [
   "12",
   "directeurs d’agence"
  ],
  "titre": "Accompagner des leaders de proximité dans la conduite d’une transformation du réseau",
  "meta": [
   "12 directeurs d’agence",
   "2 groupes de pairs",
   "Parcours sur 1 an"
  ],
  "resume": "Dans le cadre d’une évolution du maillage territorial, des directeurs d’agence devaient recomposer leurs équipes, reconstruire des repères communs, traiter des résistances et maintenir la performance dans un contexte de transformation.",
  "situation": "Dans le cadre d’une évolution du maillage territorial, des directeurs d’agence devaient recomposer leurs équipes, reconstruire des repères communs, traiter des résistances et maintenir la performance dans un contexte de transformation.",
  "enjeux": [
   "Donner du sens à la transformation et embarquer les équipes.",
   "Traiter les tensions suffisamment tôt pour éviter qu’elles ne s’installent.",
   "Arbitrer avec équité dans un contexte de recomposition.",
   "Maintenir la dynamique collective et commerciale.",
   "Éviter l’isolement des leaders et l’hétérogénéité des réponses managériales."
  ],
  "etapes": [
   [
    "Groupes de pairs",
    "Deux groupes réunissant 12 directeurs d’agence."
   ],
   [
    "Parcours dans la durée",
    "Huit séances de deux heures par groupe sur un an, en format hybride."
   ],
   [
    "Codéveloppement",
    "Travail sur des situations professionnelles réelles et sensibles, au-delà du simple échange de bonnes pratiques."
   ],
   [
    "Coaching et apports ciblés",
    "Articulation de codéveloppement, coaching et apports ciblés selon les enjeux rencontrés."
   ]
  ],
  "evolutions": "Les premiers signaux font apparaître une parole plus directe et plus authentique entre pairs, une capacité à faire émerger des enjeux communs derrière des situations individuelles et un travail concret sur les résistances, les tensions, les dynamiques commerciales et les attentes des équipes. Le parcours est en cours.",
  "demontre": "La capacité de Scoaché à accompagner une population de leaders de proximité lorsque la réussite d’une transformation dépend autant des comportements managériaux que du nouvel organigramme.",
  "proches": [
   "mazars",
   "croix-rouge-francaise",
   "chanel"
  ]
 },
 {
  "slug": "croix-rouge-francaise",
  "nom": "Croix-Rouge française",
  "echelle": "collectif",
  "kpi": null,
  "titre": "Renforcer la posture de leaders territoriaux dans un environnement complexe",
  "meta": [
   "Population de dirigeants territoriaux",
   "Séminaire collectif + coachings individuels"
  ],
  "resume": "Dans un environnement organisationnel et hiérarchique exigeant, plusieurs leaders territoriaux avaient besoin de renforcer leur capacité à tenir leur rôle dans des situations de tension, d’opposition ou de forte complexité relationnelle.",
  "situation": "Dans un environnement organisationnel et hiérarchique exigeant, plusieurs leaders territoriaux avaient besoin de renforcer leur capacité à tenir leur rôle dans des situations de tension, d’opposition ou de forte complexité relationnelle.",
  "enjeux": [
   "Prendre davantage de hauteur sous pression.",
   "S’affirmer avec sérénité face à la hiérarchie et aux interlocuteurs exigeants.",
   "Réguler les réactions émotionnelles dans les situations sensibles.",
   "Renforcer la légitimité dans le rôle.",
   "Développer une communication plus proactive et moins réactive."
  ],
  "etapes": [
   [
    "Séminaire collectif",
    "Un temps de travail partagé sur les dynamiques relationnelles, systémiques et managériales."
   ],
   [
    "Coachings individuels",
    "Des parcours personnalisés pour plusieurs dirigeants territoriaux."
   ],
   [
    "Indicateurs de progression",
    "Des objectifs et repères de progression définis pour chaque accompagnement."
   ],
   [
    "Situations réelles",
    "Un travail directement ancré dans les relations hiérarchiques, les tensions et les responsabilités effectivement rencontrées."
   ]
  ],
  "evolutions": "Les évolutions observées portent sur davantage de recul, une meilleure régulation des réactions, une affirmation plus sereine, davantage d’anticipation et une communication plus proactive. Les auto-évaluations réalisées dans les parcours montrent également une progression.",
  "demontre": "La capacité de Scoaché à combiner travail collectif et accompagnement individuel pour aider des leaders à tenir leur rôle dans des environnements humains et organisationnels complexes.",
  "proches": [
   "mazars",
   "cic",
   "chanel"
  ]
 },
 {
  "slug": "michael-page",
  "nom": "Michael Page",
  "echelle": "individuel",
  "kpi": null,
  "titre": "Faire évoluer sa posture de leader pour renforcer l’engagement et la performance collective",
  "meta": [
   "Manager à responsabilités",
   "Coaching individuel intensif"
  ],
  "resume": "Un manager expérimenté souhaitait faire évoluer sa posture de leadership afin de créer des relations de travail plus efficaces, renforcer l’engagement de son équipe et mieux comprendre l’impact de son propre fonctionnement sur le collectif.",
  "situation": "Un manager expérimenté souhaitait faire évoluer sa posture de leadership afin de créer des relations de travail plus efficaces, renforcer l’engagement de son équipe et mieux comprendre l’impact de son propre fonctionnement sur le collectif.",
  "enjeux": [
   "Créer un cadre relationnel clair et suffisamment sécurisant.",
   "Favoriser l’expression des idées, besoins et désaccords.",
   "Renforcer inclusion, reconnaissance et ouverture.",
   "Faire évoluer la posture du manager pour accroître engagement et responsabilisation.",
   "Concilier exigence de performance et qualité relationnelle."
  ],
  "etapes": [
   [
    "Diagnostic de posture",
    "Identifier les modes relationnels et leurs effets sur le collectif."
   ],
   [
    "Leadership relationnel",
    "Travailler confiance, reconnaissance, inclusion et ouverture."
   ],
   [
    "Situations réelles",
    "Expérimenter de nouveaux comportements à partir des situations professionnelles rencontrées."
   ],
   [
    "Ancrage",
    "Transformer les prises de conscience en pratiques managériales durables."
   ]
  ],
  "evolutions": "Les évolutions recherchées portaient sur une plus grande contribution des équipes, une meilleure mobilisation, une capacité à traiter plus directement les sujets relationnels et un leadership plus conscient de son impact.",
  "demontre": "La capacité de Scoaché à travailler la posture managériale lorsque la performance dépend autant du cadre relationnel créé par le leader que de son expertise.",
  "proches": [
   "ilek",
   "biborg",
   "le-lab-rh"
  ]
 },
 {
  "slug": "ilek",
  "nom": "Ilek",
  "echelle": "individuel",
  "kpi": [
   "3 → 9/10",
   "référence pour l’équipe"
  ],
  "titre": "Faire évoluer la posture de leaders dans un contexte de croissance et de transformation",
  "meta": [
   "2 leaders accompagnés",
   "Coachings individuels",
   "2024–2026"
  ],
  "resume": "Dans un environnement en évolution rapide, Ilek a confié à Scoaché deux accompagnements individuels de leaders confrontés à des enjeux complémentaires.",
  "situation": "Dans un environnement en évolution rapide, Ilek a confié à Scoaché deux accompagnements individuels de leaders confrontés à des enjeux complémentaires. Le premier concernait la consolidation d’une posture managériale après une expérience exigeante ; le second, un dirigeant prenant pour la première fois la responsabilité d’un périmètre d’environ 100 collaborateurs dans une organisation largement à distance.",
  "enjeux": [
   "Asseoir sa légitimité et sa posture dans un rôle plus exposé.",
   "Créer les conditions de la confiance et de l’engagement.",
   "Faire évoluer sa communication sans perdre en exigence ni en authenticité.",
   "Déléguer davantage et accepter différents chemins vers le résultat.",
   "Créer de la proximité lorsque la taille du collectif ou le remote réduisent les interactions informelles.",
   "Tenir sa position dans un contexte de transformation et d’incertitude."
  ],
  "etapes": [
   [
    "Posture et légitimité",
    "Clarifier la place du leader et renforcer sa capacité à assumer son rôle dans un environnement mouvant."
   ],
   [
    "Leadership et engagement",
    "Créer les conditions permettant aux équipes de contribuer pleinement."
   ],
   [
    "Communication et influence",
    "Renforcer écoute, empathie perçue et qualité des messages, y compris dans les situations difficiles."
   ],
   [
    "Leadership à l’échelle",
    "Faire évoluer rituels, relais managériaux, prises de parole et espaces informels lorsque le leader ne peut plus construire la relation uniquement en direct."
   ]
  ],
  "evolutions": "Sur le premier parcours, l’objectif global progresse de 4/10 à 7/10 et l’indicateur relatif à la capacité à devenir et rester une référence pour l’équipe de 3/10 à 9/10. Sur le second, l’objectif lié à la confiance, à la posture et à l’adhésion progresse de 5/10 à 7/10. Les parties prenantes observent une posture plus ouverte, une communication plus juste, une meilleure prise en compte des enjeux humains et des signaux favorables dans les enquêtes internes.",
  "demontre": "La capacité de Scoaché à accompagner des leaders à différents moments de leur trajectoire, de la consolidation d’une première posture managériale à l’exercice d’un leadership à l’échelle d’environ 100 personnes.",
  "proches": [
   "biborg",
   "le-lab-rh",
   "fintecture"
  ]
 },
 {
  "slug": "biborg",
  "nom": "Biborg",
  "echelle": "individuel",
  "kpi": [
   "3 → 10/10",
   "sur trois dimensions"
  ],
  "titre": "Accompagner des leaders dans les passages de seuil de leur trajectoire",
  "meta": [
   "4 leaders accompagnés depuis 2022",
   "Coachings individuels",
   "Partenariat renouvelé"
  ],
  "resume": "Depuis 2022, Biborg confie à Scoaché plusieurs leaders à différents moments de leur trajectoire.",
  "situation": "Depuis 2022, Biborg confie à Scoaché plusieurs leaders à différents moments de leur trajectoire. Les situations varient, mais partagent un même enjeu : faire évoluer la posture lorsque le rôle, les responsabilités ou les attentes de l’organisation changent.",
  "enjeux": [
   "Redéfinir son rôle et retrouver la capacité à porter une vision.",
   "Établir une nouvelle position de leadership et communiquer plus directement.",
   "Passer d’une forte implication opérationnelle à davantage de délégation et de responsabilisation.",
   "Faire gagner les équipes en autonomie sans perdre en exigence ni en performance.",
   "Continuer à créer de la valeur lorsque le rôle du leader lui-même doit évoluer."
  ],
  "etapes": [
   [
    "Cadrage du passage de seuil",
    "Clarifier le changement de rôle et ce qu’il exige concrètement."
   ],
   [
    "Situations à forts enjeux",
    "Positionnement, communication au top management, management, délégation et parties prenantes clés."
   ],
   [
    "Expérimentation",
    "Tester de nouvelles façons d’agir dans le rôle et analyser leurs effets."
   ],
   [
    "Articulation avec l’organisation",
    "Associer RH ou management lorsque pertinent, dans le respect strict de la confidentialité."
   ]
  ],
  "evolutions": "Les parcours font apparaître une posture plus affirmée, une plus grande capacité à porter une vision, une communication plus directe, de meilleurs cadrages, davantage de délégation et une moindre dépendance du collectif au leader. Sur un parcours, les auto-évaluations ont progressé de 3/10 à 10/10 sur trois dimensions suivies.",
  "demontre": "La capacité de Scoaché à accompagner plusieurs leaders d’une même organisation dans la durée, à mesure que leur niveau de responsabilité et leur mode de leadership évoluent.",
  "proches": [
   "le-lab-rh",
   "fintecture",
   "jobteaser"
  ]
 },
 {
  "slug": "le-lab-rh",
  "nom": "Le Lab RH",
  "echelle": "individuel",
  "kpi": [
   "3,5 → 9/10",
   "fermeté dans les échanges"
  ],
  "titre": "Assumer pleinement sa place de dirigeant dans une organisation en développement",
  "meta": [
   "Dirigeant",
   "Coaching individuel",
   "8 séances"
  ],
  "resume": "Dans une organisation en développement, un dirigeant souhaitait consolider sa posture pour prendre pleinement sa place, porter plus fermement ses décisions et accompagner une nouvelle étape de croissance.",
  "situation": "Dans une organisation en développement, un dirigeant souhaitait consolider sa posture pour prendre pleinement sa place, porter plus fermement ses décisions et accompagner une nouvelle étape de croissance. L’enjeu était de trouver un équilibre entre une posture de direction suffisamment affirmée et une communication préservant qualité de dialogue, écoute et engagement.",
  "enjeux": [
   "Clarifier ce que signifie réellement tenir une fonction de direction.",
   "Assumer davantage ses décisions et ses arbitrages.",
   "Gagner en fermeté sans rigidifier les relations.",
   "Ajuster sa communication aux différentes parties prenantes.",
   "Créer les conditions pour obtenir davantage de feedback.",
   "Constituer et mobiliser l’équipe nécessaire pour accompagner les ambitions de développement."
  ],
  "etapes": [
   [
    "Posture de dirigeant",
    "Clarifier rôle, place et niveau de responsabilité."
   ],
   [
    "Décision et affirmation",
    "Assumer plus clairement ses choix et renforcer sa capacité d’arbitrage."
   ],
   [
    "Communication et influence",
    "Trouver le bon équilibre entre fermeté, écoute, empathie et impact."
   ],
   [
    "Prise de recul",
    "Mieux comprendre ses modes de fonctionnement et préserver des espaces de réflexion dans un rôle exposé."
   ]
  ],
  "evolutions": "L’auto-évaluation de l’objectif principal — assumer pleinement son rôle de dirigeant — progresse de 5/10 à 8/10. La capacité à davantage s’ouvrir et solliciter du feedback passe de 1/10 à 5/10, et la capacité à gagner en fermeté dans les interactions de 3,5/10 à 9/10.",
  "demontre": "La capacité de Scoaché à accompagner un dirigeant dans un passage de seuil : lorsque l’enjeu n’est plus seulement de réussir dans son rôle, mais de l’incarner pleinement, d’assumer les arbitrages qu’il implique et d’entraîner l’organisation.",
  "proches": [
   "fintecture",
   "jobteaser",
   "homeexchange"
  ]
 },
 {
  "slug": "fintecture",
  "nom": "Fintecture",
  "echelle": "individuel",
  "kpi": [
   "5 → 7/10",
   "objectif global"
  ],
  "titre": "Faire évoluer son leadership sous forte pression sans renoncer à l’exigence de performance",
  "meta": [
   "Directeur commercial",
   "Coaching individuel",
   "10 séances + cadrage et bilan"
  ],
  "resume": "Dans un environnement de forte croissance et de forte pression sur les résultats, un directeur commercial souhaitait faire évoluer sa posture de leadership.",
  "situation": "Dans un environnement de forte croissance et de forte pression sur les résultats, un directeur commercial souhaitait faire évoluer sa posture de leadership. Très engagé, exigeant et habitué à fonctionner à un rythme élevé, il constatait que la pression absorbée pouvait parfois se répercuter sur ses équipes.",
  "enjeux": [
   "Ne pas transmettre aux équipes toute la pression reçue.",
   "Conserver lucidité et discernement dans les situations tendues.",
   "Passer d’une communication très directe à une communication plus adaptée aux personnes et aux contextes.",
   "Renforcer la qualité des recadrages et des feedbacks.",
   "Créer davantage de confiance et de proximité avec les équipes.",
   "Maintenir un haut niveau de performance sans installer une dynamique de tension permanente."
  ],
  "etapes": [
   [
    "Régulation et discernement",
    "Prendre du recul et ralentir suffisamment pour éviter les réactions trop immédiates."
   ],
   [
    "Communication et impact",
    "Adapter les messages, développer l’écoute et préserver la relation dans les situations exigeantes."
   ],
   [
    "Leadership et confiance",
    "Créer davantage d’espaces de dialogue et renforcer les échanges individuels."
   ],
   [
    "Exigence soutenable",
    "Conserver ambition, rythme et standards élevés sans transformer la pression du leader en pression systémique pour le collectif."
   ]
  ],
  "evolutions": "L’auto-évaluation de l’objectif global progresse de 5/10 à 7/10. Les parties prenantes observent davantage de recul, une communication plus posée, davantage d’écoute et de présence auprès des équipes, des relations plus sereines et l’installation progressive d’un climat de confiance. Le sponsor constate un véritable avant/après.",
  "demontre": "La capacité de Scoaché à accompagner un dirigeant performant lorsque l’enjeu n’est pas de réduire son exigence, mais de faire évoluer sa manière de l’exercer pour préserver simultanément performance, confiance et engagement.",
  "proches": [
   "jobteaser",
   "homeexchange",
   "chanel"
  ]
 },
 {
  "slug": "manomano",
  "nom": "ManoMano",
  "echelle": "organisation",
  "kpi": [
   "+200",
   "collaborateurs accompagnés"
  ],
  "titre": "Accompagner dans la durée des enjeux de leadership et d’influence",
  "meta": [
   "+200 collaborateurs accompagnés",
   "Partenariat depuis 2020",
   "Dispositif toujours actif"
  ],
  "resume": "Depuis 2020, ManoMano confie à Scoaché des accompagnements individuels autour d’enjeux de leadership, d’influence, de communication à fort impact et de posture.",
  "situation": "Depuis 2020, ManoMano confie à Scoaché des accompagnements individuels autour d’enjeux de leadership, d’influence, de communication à fort impact et de posture. Les besoins varient selon le niveau de responsabilité et le contexte, mais partagent un même enjeu : permettre à chacun d’exercer davantage d’impact à mesure que son rôle évolue.",
  "enjeux": [
   "Prendre sa place dans des environnements de plus grande séniorité.",
   "Faire évoluer une posture d’expert vers davantage de contribution stratégique et business.",
   "Renforcer l’assertivité et la qualité des prises de position.",
   "Adapter la communication aux dirigeants, aux équipes et aux parties prenantes.",
   "Renforcer l’influence et l’engagement des équipes."
  ],
  "etapes": [
   [
    "Parcours individualisés",
    "Des objectifs adaptés à chaque situation et niveau de responsabilité."
   ],
   [
    "Cadrage",
    "Définition d’objectifs et d’indicateurs de progression."
   ],
   [
    "Situations à forts enjeux",
    "Travail à partir des situations réellement rencontrées dans le rôle."
   ],
   [
    "Articulation organisationnelle",
    "Lien avec manager ou RH lorsque pertinent, dans le respect de la confidentialité."
   ]
  ],
  "evolutions": "Les parcours font apparaître une prise de parole plus stratégique, une communication plus concise et plus impactante, une meilleure adaptation aux niveaux de séniorité, davantage d’assertivité, une influence renforcée et une meilleure capacité à engager les équipes.",
  "demontre": "La capacité de Scoaché à installer une relation de confiance dans la durée et à accompagner des situations de leadership très différentes au sein d’une même organisation, sans standardiser les parcours.",
  "proches": [
   "schoolab",
   "groupe-nice-matin",
   "chanel"
  ]
 },
 {
  "slug": "schoolab",
  "nom": "Schoolab",
  "echelle": "organisation",
  "kpi": [
   "190",
   "séances individuelles"
  ],
  "titre": "Déployer un coaching individualisé à l’échelle d’une population stratégique",
  "meta": [
   "40 bénéficiaires accompagnés",
   "190 séances individuelles",
   "1 an de dispositif"
  ],
  "resume": "Dans un environnement en croissance rapide, Schoolab souhaitait proposer un accompagnement suffisamment individualisé pour répondre à des besoins de développement très différents, tout en conservant un cadre cohérent à l’échelle de l’organisation.",
  "situation": "Dans un environnement en croissance rapide, Schoolab souhaitait proposer un accompagnement suffisamment individualisé pour répondre à des besoins de développement très différents, tout en conservant un cadre cohérent à l’échelle de l’organisation. Le dispositif a concerné 40 collaborateurs, dont 16 managers — 9 Top Managers et 7 Middle Managers.",
  "enjeux": [
   "Renforcer la capacité des managers à prendre leur place et assumer leur niveau de responsabilité.",
   "Accompagner les passages d’une posture de pair ou d’expert à une posture de manager.",
   "Développer la capacité à décider, prendre position et embarquer les équipes.",
   "Mieux gérer désaccords, tensions et relations avec les parties prenantes.",
   "Aider les bénéficiaires à sortir de l’urgence et à concentrer leur énergie sur les sujets à forte valeur.",
   "Prévenir certaines situations de désengagement, surcharge ou risque de départ."
  ],
  "etapes": [
   [
    "Leadership et transitions de rôle",
    "Prendre sa place, gagner en légitimité et ajuster sa posture."
   ],
   [
    "Management et engagement",
    "Clarifier les attentes, responsabiliser, donner du feedback et mobiliser."
   ],
   [
    "Communication et influence",
    "Prendre position, gérer les désaccords et adapter sa communication."
   ],
   [
    "Prise de recul",
    "Mieux arbitrer son temps, poser des limites et préserver sa capacité à agir dans la durée."
   ]
  ],
  "evolutions": "Les retours font ressortir davantage de recul, une meilleure compréhension du rôle, une plus grande capacité à décider et à prendre position, davantage de confiance dans l’exercice du leadership et des pratiques de management et de communication plus structurées.",
  "demontre": "La capacité de Scoaché à déployer, à l’échelle d’une population, un dispositif de coaching individuel structuré tout en conservant une forte personnalisation des situations et des parcours.",
  "proches": [
   "groupe-nice-matin",
   "manomano",
   "chanel"
  ]
 },
 {
  "slug": "jobteaser",
  "nom": "Jobteaser",
  "echelle": "individuel",
  "kpi": [
   "10",
   "séances"
  ],
  "titre": "Préserver son impact et sa capacité d’action dans un environnement sous tension",
  "meta": [
   "Dirigeant",
   "Coaching individuel",
   "10 séances"
  ],
  "resume": "Dans un environnement professionnel exigeant, un dirigeant souhaitait continuer à contribuer avec engagement et intensité sans laisser les frustrations du quotidien altérer son énergie, ses relations ou sa capacité d’action.",
  "situation": "Dans un environnement professionnel exigeant, un dirigeant souhaitait continuer à contribuer avec engagement et intensité sans laisser les frustrations du quotidien altérer son énergie, ses relations ou sa capacité d’action.",
  "enjeux": [
   "Préserver son énergie et son discernement dans les situations sous tension.",
   "Rester en écoute et constructif face à des interlocuteurs aux modes de fonctionnement différents.",
   "Accepter que toutes les situations ne puissent être optimisées ou contrôlées.",
   "Formuler des feedbacks exigeants sans détériorer la relation.",
   "Maintenir sa capacité de contribution malgré l’incertitude ou les désaccords.",
   "Trouver le bon équilibre entre performance individuelle, coopération et recul."
  ],
  "etapes": [
   [
    "Régulation et prise de recul",
    "Identifier ce qui relève de son champ d’action et préserver son énergie."
   ],
   [
    "Communication et qualité relationnelle",
    "Maintenir écoute active et capacité de dialogue dans les interactions générant de la frustration."
   ],
   [
    "Exigence et influence",
    "Conserver un niveau élevé d’exigence en ajustant la manière de formuler feedbacks, désaccords et attentes."
   ],
   [
    "Discernement dans l’action",
    "Sortir d’une logique d’optimisation permanente pour concentrer son attention sur les efforts réellement créateurs de valeur."
   ]
  ],
  "evolutions": "Le travail a permis de consolider plusieurs repères : mieux distinguer ce qui dépend de soi, préserver son énergie dans les interactions difficiles, développer l’écoute active, relativiser la recherche systématique d’efficience, mieux organiser les moments de concentration et formuler des feedbacks exigeants avec davantage de maîtrise.",
  "demontre": "La capacité de Scoaché à accompagner des dirigeants dont l’enjeu n’est plus seulement de faire plus, mais de préserver leur impact, leur discernement et leur qualité de leadership lorsque l’environnement devient plus exigeant.",
  "proches": [
   "homeexchange",
   "chanel",
   "vinci-airports"
  ]
 },
 {
  "slug": "groupe-nice-matin",
  "nom": "Groupe Nice-Matin",
  "echelle": "organisation",
  "kpi": null,
  "titre": "Faire évoluer la posture de managers clés dans un contexte de transformation",
  "meta": [
   "Plusieurs managers accompagnés",
   "Coachings individuels",
   "Contexte de transformation"
  ],
  "resume": "Dans un contexte d’évolution de l’organisation et d’exigence accrue, le Groupe Nice-Matin a confié à Scoaché plusieurs accompagnements individuels de managers amenés à faire évoluer leur posture et leur niveau de responsabilité.",
  "situation": "Dans un contexte d’évolution de l’organisation et d’exigence accrue, le Groupe Nice-Matin a confié à Scoaché plusieurs accompagnements individuels de managers amenés à faire évoluer leur posture et leur niveau de responsabilité.",
  "enjeux": [
   "Déléguer davantage sans perdre en exigence ni en fiabilité.",
   "Renforcer son assurance et sa légitimité dans le rôle.",
   "Communiquer de manière plus claire, directe et structurante.",
   "Tenir sa position dans des environnements sous pression.",
   "Fédérer les équipes et renforcer leur responsabilisation.",
   "Prendre davantage le lead sur son périmètre et gagner en influence auprès de la direction."
  ],
  "etapes": [
   [
    "Prise de hauteur et délégation",
    "Sortir progressivement de l’exécution et renforcer l’autonomie des équipes."
   ],
   [
    "Leadership et légitimité",
    "Prendre pleinement sa place et développer une posture plus fédératrice."
   ],
   [
    "Communication et influence",
    "Clarifier les attentes et renforcer l’impact auprès des équipes et de la direction."
   ],
   [
    "Posture dans les situations à forts enjeux",
    "Maintenir recul, discernement et capacité d’action dans les périodes de forte pression ou de transformation."
   ]
  ],
  "evolutions": "Les bilans font apparaître davantage de délégation, une posture plus affirmée, une progression de la légitimité et de la crédibilité perçues, une communication plus directe, une meilleure capacité à fédérer et une reconnaissance accrue par le management. Les sponsors ont également exprimé l’intérêt d’élargir ce type de coaching à d’autres populations de management.",
  "demontre": "La capacité de Scoaché à accompagner plusieurs managers d’une même organisation lorsque l’évolution du contexte exige un changement de posture, de niveau de responsabilité et de leadership.",
  "proches": [
   "manomano",
   "schoolab",
   "chanel"
  ]
 },
 {
  "slug": "homeexchange",
  "nom": "HomeExchange",
  "echelle": "individuel",
  "kpi": null,
  "titre": "Trouver son alignement pour asseoir son leadership et mieux embarquer ses équipes",
  "meta": [
   "Dirigeante fonctionnelle",
   "Coaching individuel",
   "Accompagnement en cours"
  ],
  "resume": "Dans un contexte à forts enjeux stratégiques et organisationnels, une dirigeante fonctionnelle souhaitait prendre davantage de hauteur, exprimer plus clairement ses besoins et renforcer son leadership afin de mieux embarquer ses équipes et ses interlocuteurs.",
  "situation": "Dans un contexte à forts enjeux stratégiques et organisationnels, une dirigeante fonctionnelle souhaitait prendre davantage de hauteur, exprimer plus clairement ses besoins et renforcer son leadership afin de mieux embarquer ses équipes et ses interlocuteurs.",
  "enjeux": [
   "Trouver un alignement suffisamment solide pour s’affirmer sans sur-adaptation.",
   "Identifier et exprimer plus clairement ses besoins.",
   "Renforcer sa légitimité et sa capacité à prendre position.",
   "Créer un cadre relationnel favorisant confiance et engagement.",
   "Aligner posture personnelle, rôle et dynamique collective."
  ],
  "etapes": [
   [
    "Alignement et prise de hauteur",
    "Clarifier les repères permettant de décider et d’agir avec davantage de cohérence."
   ],
   [
    "Assertivité et leadership",
    "Renforcer la capacité à exprimer ses besoins et tenir sa position."
   ],
   [
    "Confiance et dynamique d’équipe",
    "Créer des conditions relationnelles favorisant l’adhésion et l’engagement."
   ],
   [
    "Situations réelles",
    "Travailler directement à partir des situations stratégiques et organisationnelles rencontrées."
   ]
  ],
  "evolutions": "L’accompagnement étant en cours, les évolutions finales ne sont pas encore établies. Les indicateurs suivis portent notamment sur la clarté dans l’expression des besoins, la solidité de la posture, la confiance dans le rôle et la capacité à créer davantage d’adhésion.",
  "demontre": "La capacité de Scoaché à accompagner le moment où l’enjeu n’est plus seulement de bien exercer sa fonction, mais de trouver la posture permettant de l’incarner pleinement et d’embarquer les autres.",
  "proches": [
   "chanel",
   "vinci-airports",
   "michael-page"
  ]
 }
]''')

PAR_SLUG = {c['slug']: c for c in DONNEES}

ECHELLES = {
    'individuel': 'Coaching individuel',
    'collectif': 'Coaching collectif',
    'organisation': 'Coaching d’organisation',
}

NOMBRES = {1: 'Un axe', 2: 'Deux axes', 3: 'Trois axes', 4: 'Quatre axes', 5: 'Cinq axes', 6: 'Six axes'}

FLECHE = '<svg class="ico" width="{0}" height="{0}" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg>'


def e(texte):
    return html.escape(texte, quote=True)


def taille_png(chemin):
    with open(chemin, 'rb') as f:
        tete = f.read(24)
    return struct.unpack('>II', tete[16:24])


def logo(slug, max_l, max_h, aire, classe='', alt=None, charge='lazy'):
    """Balise img du logo, taille optique : surface à peu près constante, bornée par la boîte."""
    l, h = taille_png(os.path.join(RACINE, 'assets/cas/logos', slug + '.png'))
    ratio = l / h
    largeur = (aire * ratio) ** 0.5
    hauteur = largeur / ratio
    if largeur > max_l:
        largeur, hauteur = max_l, max_l / ratio
    if hauteur > max_h:
        largeur, hauteur = max_h * ratio, max_h
    nom = PAR_SLUG[slug]['nom'] if alt is None else alt
    attr_classe = f' class="{classe}"' if classe else ''
    return (f'<img{attr_classe} src="/assets/cas/logos/{slug}.png" alt="{e(nom)}" '
            f'width="{round(largeur)}" height="{round(hauteur)}" loading="{charge}" decoding="async">')


def puce_photo(cas):
    """Chiffre clé quand il existe, sinon le logo du client (comme dans le Figma)."""
    if cas['kpi']:
        valeur, libelle = cas['kpi']
        return (f'<span class="stat stat--verre"><span class="stat__valeur">{e(valeur)}</span>'
                f'<span class="stat__libelle">{e(libelle)}</span></span>')
    return f'<span class="logo-puce cas-puce">{logo(cas["slug"], 120, 34, 120 * 34 * 0.5, alt="")}</span>'


def meta_ligne(cas):
    elements = cas['meta']
    sortie = [elements[0]]
    for el in elements[1:]:
        sortie.append(el[0].lower() + el[1:] if el[:1].isupper() and not el.isupper() else el)
    return ', '.join(sortie)


def tete(titre, description, chemin):
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titre)}</title>
  <meta name="description" content="{e(description)}">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="https://scoache-site-web.vercel.app{chemin}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/css/cas.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="/include.js" defer></script>
  <script src="/script.js" defer></script>
</head>
<body class="page-cas">
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="page">
  <div data-include="header"></div>

  <main id="contenu" tabindex="-1">
'''


PIED = '''
    <div data-include="contact"></div>
  </main>

  <div data-include="footer"></div>
</div>
'''


def barre(texte):
    return f'''<div class="plateau">
        <div class="barre">
          <p class="barre__texte"><svg class="ico" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-message"/></svg>{e(texte)}</p>
          <a class="btn btn--noir" href="/nous-contacter">Nous contacter {FLECHE.format(16)}</a>
        </div>
      </div>'''


# ---------------------------------------------------------------- page liste

def ligne(cas, rang):
    slug = cas['slug']
    url = f'/cas-clients/{slug}'
    return f'''        <li class="cas-ligne" data-echelle="{cas['echelle']}">
          <div class="cas-ligne__marque">
            <span class="cas-ligne__logo">{logo(slug, 170, 48, 170 * 48 * 0.5)}</span>
            <p class="cas-ligne__echelle">{ECHELLES[cas['echelle']]}</p>
            <p class="cas-ligne__meta">{e(meta_ligne(cas))}</p>
          </div>
          <div class="cas-ligne__corps">
            <h3 class="cas-ligne__titre"><a href="{url}">{e(cas['titre'])}</a></h3>
            <p class="cas-ligne__resume">{e(cas['resume'])}</p>
            <a class="link-caps link-caps--accent" href="{url}">Lire le cas<span class="visually-hidden"> {e(cas['nom'])}</span> {FLECHE.format(16)}</a>
          </div>
          <a class="photo cas-ligne__photo" href="{url}" tabindex="-1" aria-hidden="true">
            <img src="/assets/cas/photos/{slug}-m.jpg" alt="" width="600" height="420" loading="{'eager' if rang < 2 else 'lazy'}" decoding="async">
            {puce_photo(cas)}
          </a>
        </li>'''


def page_liste():
    mur = '\n'.join(
        f'            <li><a href="/cas-clients/{c["slug"]}">{logo(c["slug"], 150, 44, 150 * 44 * 0.42, charge="eager")}</a></li>'
        for c in DONNEES)
    lignes = '\n'.join(ligne(c, i) for i, c in enumerate(DONNEES))
    filtres = '\n'.join(
        f'          <button type="button" class="filtre" aria-pressed="{"true" if v == "tous" else "false"}" data-filtre-cas="{v}">{t}</button>'
        for v, t in [('tous', 'Tous les cas'), ('individuel', 'Individuel'), ('collectif', 'Collectif'), ('organisation', 'Organisation')])
    corps = f'''    <nav class="fil-ariane" aria-label="Fil d’Ariane">
      <ol>
        <li><a href="/">Accueil</a></li>
        <li aria-current="page">Cas clients</li>
      </ol>
    </nav>

    <section class="section section--plateau" aria-labelledby="titre-page">
      <div class="plateau cas-hero">
        <div class="cas-hero__texte">
          <div class="cas-hero__intro">
            <p class="eyebrow eyebrow--lg">Cas clients</p>
            <h1 class="cas-hero__titre" id="titre-page">Nos accompagnements, de CHANEL à ManoMano</h1>
            <p class="cas-hero__lead">Dirigeants, équipes de direction, populations de managers : pour chaque cas, la situation, ce qui se jouait, l’accompagnement et les évolutions observées.</p>
            <a class="btn btn--noir btn--lg" href="/nous-contacter">Nous contacter {FLECHE.format(18)}</a>
          </div>
          <p class="hero__preuve"><svg class="ico" width="14" height="14" aria-hidden="true"><use href="/assets/icones.svg#i-star"/></svg>4,9/5 sur Google, 94 % de satisfaction en 2025</p>
        </div>
        <div class="carte cas-hero__carte">
          <h2 class="cas-surtitre">Ils nous ont confié leurs dirigeants</h2>
          <ul class="cas-mur">
{mur}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="titre-liste">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Les cas clients</p>
          <h2 class="section-head__title" id="titre-liste">Tous les accompagnements</h2>
        </div>
        <div class="filtres cas-filtres" role="group" aria-label="Filtrer par échelle d’accompagnement">
{filtres}
        </div>
      </div>
      <ul class="cas-liste" id="cas-liste">
{lignes}
      </ul>
    </section>

    <section class="section cas-section-barre" aria-label="Nous contacter">
      {barre('Votre situation ressemble à l’un de ces cas ? Parlons-en.')}
    </section>
'''
    script = '''<script>
  (function () {
    var boutons = document.querySelectorAll('[data-filtre-cas]');
    var lignes = document.querySelectorAll('#cas-liste > li');
    boutons.forEach(function (bouton) {
      bouton.addEventListener('click', function () {
        var valeur = bouton.getAttribute('data-filtre-cas');
        boutons.forEach(function (b) { b.setAttribute('aria-pressed', b === bouton ? 'true' : 'false'); });
        lignes.forEach(function (li) {
          li.hidden = valeur !== 'tous' && li.getAttribute('data-echelle') !== valeur;
        });
      });
    });
  })();
</script>
'''
    sortie = (tete('Cas clients, Scoaché',
                   'Nos accompagnements de dirigeants, d’équipes de direction et de populations de managers, de CHANEL à ManoMano : la situation, ce qui se jouait, l’accompagnement et les évolutions observées.',
                   '/cas-clients')
              + corps + PIED + script + '</body>\n</html>\n')
    with open(os.path.join(RACINE, 'cas-clients.html'), 'w', encoding='utf-8') as f:
        f.write(sortie)


# ---------------------------------------------------------------- pages cas

def carte_proche(cas):
    slug = cas['slug']
    return f'''        <li>
          <a class="photo photo--entre cas-carte" href="/cas-clients/{slug}">
            <img src="/assets/cas/photos/{slug}-m.jpg" alt="" width="806" height="920" loading="lazy" decoding="async">
            {puce_photo(cas)}
            <span class="carte-verre cas-carte__verre">
              <span class="cas-carte__surtitre">Cas client, {e(cas['nom'])}</span>
              <span class="cas-carte__titre">{e(cas['titre'])}</span>
              <span class="cas-carte__lien">Lire le cas {FLECHE.format(16)}</span>
            </span>
          </a>
        </li>'''


def page_cas(cas):
    slug = cas['slug']
    echelle = ECHELLES[cas['echelle']]
    pastilles = '\n'.join(f'              <li>{e(m)}</li>' for m in cas['meta'])
    enjeux = '\n'.join(f'            <li>{e(t)}</li>' for t in cas['enjeux'])
    etapes = '\n'.join(
        f'''        <li class="carte cas-etape">
          <span class="cas-etape__num" aria-hidden="true">{i:02d}</span>
          <h3 class="cas-etape__titre"><span class="visually-hidden">{i:02d}, </span>{e(titre)}</h3>
          <p class="cas-etape__texte">{e(texte)}</p>
        </li>''' for i, (titre, texte) in enumerate(cas['etapes'], 1))
    chiffre = ''
    if cas['kpi']:
        valeur, libelle = cas['kpi']
        chiffre = (f'\n          <p class="cas-chiffre"><span class="cas-chiffre__valeur">{e(valeur)}</span>'
                   f'<span class="cas-chiffre__libelle">{e(libelle)}</span></p>')
    proches = '\n'.join(carte_proche(PAR_SLUG[s]) for s in cas['proches'])
    nb_axes = NOMBRES.get(len(cas['etapes']), f'{len(cas["etapes"])} axes')

    corps = f'''    <nav class="fil-ariane" aria-label="Fil d’Ariane">
      <ol>
        <li><a href="/">Accueil</a></li>
        <li><a href="/cas-clients">Cas clients</a></li>
        <li aria-current="page">{e(cas['nom'])}</li>
      </ol>
    </nav>

    <section class="section section--plateau" aria-labelledby="titre-page">
      <div class="plateau cas-fiche">
        <div class="cas-fiche__texte">
          <div class="cas-fiche__intro">
            <span class="cas-fiche__logo">{logo(slug, 170, 48, 170 * 48 * 0.5, charge='eager')}</span>
            <p class="eyebrow eyebrow--lg">Cas client, {echelle[0].lower() + echelle[1:]}</p>
            <h1 class="cas-fiche__titre" id="titre-page">{e(cas['titre'])}</h1>
            <ul class="cas-pastilles" aria-label="En bref">
{pastilles}
            </ul>
          </div>
          <a class="link-caps link-caps--accent" href="/cas-clients">Tous les cas clients {FLECHE.format(16)}</a>
        </div>
        <div class="carte cas-fiche__carte">
          <div class="photo cas-fiche__photo">
            <img src="/assets/cas/photos/{slug}.jpg" alt="" width="1264" height="1200" fetchpriority="high" decoding="async">
            <div class="cas-situation">
              <h2 class="cas-situation__titre">Situation</h2>
              <p class="cas-situation__texte">{e(cas['situation'])}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="titre-enjeux">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Ce qui se jouait</p>
          <h2 class="section-head__title" id="titre-enjeux">Les enjeux de départ</h2>
        </div>
      </div>
      <div class="plateau">
        <div class="carte cas-enjeux">
          <ul class="cas-enjeux__liste">
{enjeux}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="titre-accompagnement">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">L’accompagnement</p>
          <h2 class="section-head__title" id="titre-accompagnement">{nb_axes} de travail</h2>
        </div>
      </div>
      <ol class="plateau cas-etapes">
{etapes}
      </ol>
    </section>

    <section class="section cas-section-evolutions" aria-label="Évolutions observées et enseignements">
      <div class="plateau cas-evolutions">
        <div class="carte cas-evolutions__carte">
          <h2 class="cas-surtitre-13">Évolutions observées</h2>{chiffre}
          <p class="cas-evolutions__texte">{e(cas['evolutions'])}</p>
        </div>
        <div class="carte cas-demontre">
          <h2 class="cas-surtitre-13">Ce que ce cas démontre</h2>
          <p class="cas-demontre__texte">{e(cas['demontre'])}</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="titre-proches">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Autres cas clients</p>
          <h2 class="section-head__title" id="titre-proches">D’autres situations proches</h2>
        </div>
        <a class="link-caps link-caps--accent section-head__link" href="/cas-clients">Tous les cas clients {FLECHE.format(16)}</a>
      </div>
      <ul class="cas-proches">
{proches}
      </ul>
      {barre('Votre situation ressemble à celle-ci ? Parlons-en.')}
    </section>
'''
    titre_page = f'{cas["nom"]}, cas client, Scoaché'
    description = f'Cas client {cas["nom"]} : {cas["titre"][0].lower() + cas["titre"][1:]}.'
    sortie = tete(titre_page, description, f'/cas-clients/{slug}') + corps + PIED + '</body>\n</html>\n'
    with open(os.path.join(RACINE, 'cas-clients', slug + '.html'), 'w', encoding='utf-8') as f:
        f.write(sortie)


if __name__ == '__main__':
    page_liste()
    for c in DONNEES:
        page_cas(c)
    print('Pages générées :', 1 + len(DONNEES))
