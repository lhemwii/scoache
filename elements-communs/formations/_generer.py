#!/usr/bin/env python3
"""Génère les fiches /formations/<slug> (24 formations).

Usage : python3 formations/_generer.py   (depuis le dossier elements-communs)

Contenu repris des fiches du site actuel (https://scoache.com/formations/<...>/, URL dans
« source ») : titre, objectif, les trois objectifs pédagogiques, méthodes (« Ingénierie
pédagogique »), public, durées des parcours, témoignage Google affiché sur la fiche.
Seules adaptations : « & » écrit « et », apostrophes typographiques, majuscule en début
de phrase, coquilles évidentes corrigées.
Faits communs à toutes les fiches, faute de contenu propre sur le site actuel : sessions
individuelles de 1 h, présentiel à Paris ou distanciel (Zoom, Mural, Calendly),
évaluation, tarif sur devis, financement OPCO, prérequis, délai d'accès, accessibilité,
indicateurs de satisfaction. Photos : assets/formations/<slug>.jpg (bandeaux du site actuel).
"""
import html
import json
import os

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DONNEES = json.loads(r'''
[
 {
  "slug": "confiance-et-leadership",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/confiance-leadership/",
  "titre": "Confiance et leadership",
  "objectif": "Coaching visant à mieux se connaître et à renforcer sa confiance pour déployer son plein potentiel.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership",
   "Prendre conscience et lever les freins limitant le déploiement de son plein potentiel",
   "Capitaliser sur ses talents naturels afin de nourrir une solide confiance en soi pour mieux s’affirmer en tant que leader"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Le coaching d’Ilana m’a permis de reposer les enjeux qui me préoccupaient, à relativiser, à reprendre confiance et à identifier toutes mes forces. Ilana a su créer (par Zoom en plus !) un climat de confiance et d’écoute absolument essentiel pour avancer sereinement.",
   "role": "Senior Lead Sales, B2B"
  }
 },
 {
  "slug": "leadership-et-conduite-du-changement",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/leadership-conduite-du-changement/",
  "titre": "Leadership et conduite du changement",
  "objectif": "Coaching visant à renforcer son leadership dans un contexte exigeant et en changement.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership",
   "Prendre conscience de ses talents naturels et développer ses compétences adaptatives pour conduire le changement",
   "Apprendre à faire preuve d’adaptation, en particulier, dans sa posture et sa communication, pour atteindre ses objectifs"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Encore 1 an après je me replonge dans les livrables pour continuer ce travail si fructueux. Une coach avec une grande profondeur intellectuelle qui saura s’adapter à vos besoins et vous mettre sur la voie pour apporter des réponses très concrètes à vos problématiques.",
   "role": "Partner and Member of the Executive Board"
  }
 },
 {
  "slug": "leadership-feminin",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/leadership-feminin/",
  "titre": "Leadership féminin",
  "objectif": "Coaching visant à développer et renforcer son leadership.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership",
   "Prendre conscience de ses croyances limitantes et trouver des stratégies efficaces pour s’en libérer",
   "Déployer tout son potentiel de leader, en toutes circonstances, et devant tous types d’audiences"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Très professionnelle mais aussi humaine, Ilana nous met en confiance de suite et arrive à nous faire comprendre comment décortiquer nos problèmes pour qu’on trouve la solution nous-mêmes. Je la recommande fortement.",
   "role": "Community Event and Social Media"
  }
 },
 {
  "slug": "leadership-posture-et-communication",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/leadership-posture-communication/",
  "titre": "Leadership, posture et communication",
  "objectif": "Coaching visant à développer ou renforcer une posture de leader grâce à une communication impactante.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership et sa communication",
   "Adopter une posture de leader qui s’appuie sur ses forces et talents naturels afin d’embarquer les équipes avec ou sans lien hiérarchique direct",
   "Acquérir des techniques de communication spontanée ou préparée, afin d’avoir de l’impact devant tous types d’audiences"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "The sessions are exceptional, you enter in one mood, and leave the session with another, with clear ideas and guidelines that help effectively. Highly recommended, do not hesitate!",
   "role": "Head of After Sales for Southern Europe"
  }
 },
 {
  "slug": "leadership-et-prise-de-parole-en-public",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/leadership-prise-de-parole-en-public/",
  "titre": "Leadership et prise de parole en public",
  "objectif": "Coaching visant à gagner en leadership grâce à des prises de parole en public impactantes.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership et sa prise de parole en public",
   "Acquérir les fondamentaux des techniques oratoires pour gagner en leadership et en impact",
   "Oser assumer son style en puisant dans sa personnalité et ses talents naturels pour inspirer et convaincre"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Excellent accompagnement en public speaking, pour préparer des interventions & interview publiques, mais aussi à usage interne entreprise. Cadré, opérationnel et résultats probants. Je recommande fortement.",
   "role": "Head of Paid Acquisition"
  }
 },
 {
  "slug": "leadership-et-vision-strategique",
  "famille": "Leadership",
  "source": "https://scoache.com/formations/leadership-vision-strategique/",
  "titre": "Leadership et vision stratégique",
  "objectif": "Parcours visant à trouver les ressorts personnels et les leviers opérationnels pour porter une vision stratégique.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de leadership",
   "Réussir à prendre de la hauteur pour construire la feuille de route permettant la concrétisation de sa vision",
   "Apprendre à transmettre sa vision par une communication stratégique et impactante afin de renforcer chacun dans son rôle et son implication"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "J’ai vécu une super expérience durant mes séances de coaching. C’est un accompagnement ultra personnalisé, qui aura clairement un impact sur le long terme.",
   "role": "Head of Sellers Quality"
  }
 },
 {
  "slug": "prise-de-poste-de-manager",
  "famille": "Management",
  "source": "https://scoache.com/formations/prise-de-poste-de-manager/",
  "titre": "Prise de poste de manager",
  "objectif": "Réussir sa prise de poste de manager ou de manager de managers.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à sa prise de poste de manager",
   "Réussir à adopter la bonne posture, le bon rythme et niveau d’implication opérationnel pour répondre aux attentes sur le poste",
   "Apprendre à identifier rapidement ses besoins et les besoins de son ou de ses équipes, pour y répondre et ainsi atteindre, dans un temps optimal, ses objectifs"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Method was great to focus on the most pressing issue. On the weeks that followed I felt great improvement on the area that we have identified during the session. The whole session flowed very naturally.",
   "role": "Senior Modelling Analyst"
  }
 },
 {
  "slug": "management-et-assertivite",
  "famille": "Management",
  "source": "https://scoache.com/formations/management-assertivite-2/",
  "titre": "Management et assertivité",
  "objectif": "Coaching visant à développer un management assertif en toutes situations.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de management",
   "Réussir à adopter une posture d’affirmation de soi tout en conservant une attitude ouverte et positive",
   "Apprendre à faire preuve de leadership dans son management pour construire et maintenir des relations de travail fluides et fructueuses"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Un coach de cette qualité exceptionnelle m’a permis de mieux comprendre mes objectifs et de gagner tant en performance qu’en qualité de vie.",
   "role": "Dirigeant"
  }
 },
 {
  "slug": "management-collaboration-et-delegation",
  "famille": "Management",
  "source": "https://scoache.com/formations/management-collaboration-delegation/",
  "titre": "Management, collaboration et délégation",
  "objectif": "Coaching visant à s’approprier les bonnes pratiques en matière de collaboration et de délégation.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de management",
   "Prendre conscience de ce qui limite une collaboration et délégation optimales et réussir à se positionner au bon niveau par rapport à l’opérationnel",
   "Déléguer efficacement grâce à la matrice d’Eisenhower et à des techniques de communication, afin d’accroître l’engagement de ses managés et se libérer ainsi du temps pour ses attributions de manager"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Les séances de coaching ont eu un réel impact positif sur mon management. J’ai aussi appris à gérer mon temps de travail pour traiter les priorités dans les meilleurs délais et éviter les urgences autant que possible. Aujourd’hui le résultat est prometteur et gage d’un avenir professionnel serein.",
   "role": "Gérante chez Schoolbar"
  }
 },
 {
  "slug": "management-et-communication-impactante",
  "famille": "Management",
  "source": "https://scoache.com/formations/management-communication-impactante/",
  "titre": "Management et communication impactante",
  "objectif": "Coaching visant à performer en tant que manager grâce à une communication impactante.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de management",
   "Améliorer ses compétences relationnelles et de communication pour manager avec impact en toutes circonstances (animation de la vie d’équipe, réunions à enjeux stratégiques…)",
   "Acquérir les techniques oratoires pour une communication managériale globale impactante"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "I strongly recommend Ilana for your future coaching sessions.",
   "role": "Content strategist & content producer"
  }
 },
 {
  "slug": "management-et-posture-coach",
  "famille": "Management",
  "source": "https://scoache.com/formations/management-posture-coach/",
  "titre": "Management et posture coach",
  "objectif": "Coaching visant à apprendre à adopter la posture de manager-coach afin d’atteindre ses objectifs de manager et d’équipe.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de management",
   "Apprendre à adopter la posture de manager-coach pour améliorer les relations, libérer le potentiel de ses managés et accroître l’engagement et l’efficacité de son équipe",
   "Réussir à prendre cette posture dans des situations managériales complexes"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "La méthodologie employée durant les séances est très efficace. Sans m’en rendre compte, j’ai établi une road map de mes actions futures et de la meilleure posture à adopter. Les séances de coaching m’ont beaucoup apporté dans ma propre manière de coacher.",
   "role": "Responsable Commercial Événementiel"
  }
 },
 {
  "slug": "management-et-situations-complexes",
  "famille": "Management",
  "source": "https://scoache.com/formations/management-situations-complexes/",
  "titre": "Management et situations complexes",
  "objectif": "Coaching visant à développer sa capacité d’adaptation et de communication pour dénouer des situations managériales complexes.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à son style de management",
   "Apprendre à adopter la posture de manager-coach comme levier de résolution",
   "Utiliser l’approche Communication Non Violente pour comprendre ses besoins et les besoins des parties prenantes afin de faire émerger une solution optimale et durable"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Super coaching, super accompagnement ! Merci.",
   "role": "Head of Sales"
  }
 },
 {
  "slug": "donner-et-recevoir-du-feedback",
  "famille": "Management",
  "source": "https://scoache.com/formations/donner-recevoir-du-feedback/",
  "titre": "Donner et recevoir du feedback",
  "objectif": "Apprendre à donner du feedback constructif et à recevoir tous types de feedbacks.",
  "objectifs": [
   "Identifier son objectif dans le cadre de situations où il y a des feedbacks à donner ou à recevoir",
   "Comprendre les fondamentaux d’un feedback constructif et pratiquer en se basant notamment sur l’approche Communication Non Violente",
   "Améliorer sa capacité à recevoir un feedback non constructif et à réagir en restant, soi-même, ouvert et constructif"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8
  ],
  "avis": {
   "texte": "Ilana sait créer un climat de confiance propice à l’échange et à la réflexion. En 4 séances, elle m’a apporté de précieux conseils mais m’a également fait grandir grâce à des outils et méthodes adaptés à mes besoins. Je ne peux que recommander Scoaché !",
   "role": "Lead New Countries B2B"
  }
 },
 {
  "slug": "communication-impactante",
  "famille": "Communication",
  "source": "https://scoache.com/formations/communication-impactante/",
  "titre": "Communication impactante",
  "objectif": "Gagner en aisance et en leadership grâce à une communication impactante.",
  "objectifs": [
   "Identifier avec précision son objectif par rapport à sa communication, à date, versus celle visée, dans le cadre de ses interactions professionnelles",
   "Acquérir les techniques, bonnes pratiques et tips pour une communication impactante préparée ou spontanée",
   "Développer, plus largement, son intelligence relationnelle pour interagir avec impact en toutes circonstances"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "Sincèrement apprécié les sessions de coaching avec Ilana qui a su me fournir toutes les clés pour progresser vers ce que je visais. Il y aura un avant et un après cette formation dans mes prises de parole. Encore merci !",
   "role": "Lead Growth Engineer"
  }
 },
 {
  "slug": "communication-non-violente",
  "famille": "Communication",
  "source": "https://scoache.com/formations/communication-non-violente-objectif-acquerir-les-fondamentaux-de-la-cnv-pour-des-echanges-sereins-et-efficaces-identifier-son-objectif-sa-problematique-principale-par-rapport-a-sa-maniere-de-commun/",
  "titre": "Communication non violente",
  "objectif": "Acquérir les fondamentaux de la CNV pour des échanges sereins et constructifs.",
  "objectifs": [
   "Identifier son objectif par rapport à sa manière de communiquer",
   "Apprendre à observer les situations de manière factuelle, comprendre et gérer ses émotions pour identifier ses besoins et les besoins de son interlocuteur",
   "Apprendre à écouter et interagir sereinement, en toutes circonstances, afin d’augmenter la qualité des échanges et des relations"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Frankly on top. Pro, very cool and really there for you, I recommend 1000%, I really improved thank you for everything.",
   "role": "Responsable clientèle"
  }
 },
 {
  "slug": "prise-de-parole-en-public",
  "famille": "Communication",
  "source": "https://scoache.com/formations/prise-de-parole-en-public/",
  "titre": "Prise de parole en public, niveau 1",
  "objectif": "Réussir ses prises de parole en public devant tous types d’audiences.",
  "objectifs": [
   "Identifier son objectif par rapport à ses prises de parole en public",
   "Comprendre et lever les freins pour une prise de parole en public réussie en toutes circonstances (spontanée ou préparée, petite ou large audience…)",
   "Acquérir les techniques d’art oratoire pour réussir à inspirer et convaincre avec panache"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "J’ai suivi avec Scoaché ma meilleure formation depuis bien longtemps ! Le format est juste parfait. Elle m’a fait faire un grand pas en avant vers des prises de parole en public maîtrisées et en toute confiance.",
   "role": "Architecte sécurité"
  }
 },
 {
  "slug": "prise-de-parole-en-public-niveau-2",
  "famille": "Communication",
  "source": "https://scoache.com/formations/prise-de-parole-en-public-niveau-2/",
  "titre": "Prise de parole en public, niveau 2",
  "objectif": "Affiner son style oratoire pour gagner en leadership et en impact lors de ses prises de parole en public.",
  "objectifs": [
   "Identifier son objectif principal par rapport à ses prises de parole en public",
   "Consolider et enrichir ses acquis en art oratoire pour renforcer son aisance",
   "Oser assumer son style en puisant dans sa personnalité et ses talents naturels pour inspirer et convaincre avec panache"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Mémo de techniques oratoires",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "I have just completed several sessions of coaching on public speaking. I was able to draw a roadmap by understanding by myself the points of improvement, it will serve me for a long time. And I’ve already seen results on my last interventions. I really recommend SCOACHE.",
   "role": "Platform Engineering Manager"
  }
 },
 {
  "slug": "relations-de-confiance",
  "famille": "Communication",
  "source": "https://scoache.com/formations/relation-de-confiance/",
  "titre": "Relations de confiance",
  "objectif": "Réussir à créer ou recréer des relations de confiance grâce à des techniques de communication simples et efficaces.",
  "objectifs": [
   "Identifier son objectif par rapport à la qualité de ses relations professionnelles",
   "Apprendre à décrypter ce qui a pu, ou ce qui peut conduire, à la rupture du lien de confiance",
   "Développer son intelligence émotionnelle et relationnelle et ses aptitudes en communication pour créer ou recréer des relations de confiance"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "Super coaching ! Un grand merci.",
   "role": "Community Builder"
  }
 },
 {
  "slug": "confiance-en-soi",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/confiance-en-soi/",
  "titre": "Confiance en soi",
  "objectif": "Apprendre à mieux se connaître et croire en ses capacités personnelles pour atteindre ses objectifs professionnels.",
  "objectifs": [
   "Identifier son objectif par rapport au sujet de la confiance en soi",
   "Prendre conscience des freins limitant le déploiement de son plein potentiel professionnel",
   "Capitaliser sur ses talents naturels afin de nourrir une solide confiance en soi pour mieux s’affirmer grâce à une meilleure posture et communication"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Les sessions avec Ilana ont été une réelle bulle d’air, un moment de décompression et d’aide. C’est très aidant d’avoir une figure externe qui nous aide à débloquer des sujets et atterrir sur des problématiques qu’on ne voyait pas forcément.",
   "role": "Cheffe de projet innovation, UX"
  }
 },
 {
  "slug": "gestion-des-emotions",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/gestion-des-emotions/",
  "titre": "Gestion des émotions",
  "objectif": "Réussir à gérer ses émotions pour allier épanouissement et performance professionnels.",
  "objectifs": [
   "Identifier son objectif par rapport à sa manière de gérer ses émotions dans son environnement professionnel",
   "Observer et apprendre à identifier et gérer ses émotions pour maintenir sa lucidité et sa capacité à agir ou réagir",
   "Apprendre à rester serein et performant lors de situations qui génèrent des émotions fortes pour soi et/ou ses interlocuteurs"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "Ilana est un coach brillant. Elle a abordé chacune de nos séances avec empathie, confiance et avec beaucoup de compassion. Ses conseils m’ont énormément aidé. Je la recommande très fortement.",
   "role": "Director Of Communications"
  }
 },
 {
  "slug": "gestion-du-stress",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/gestion-du-stress-2/",
  "titre": "Gestion du stress",
  "objectif": "Réussir à gérer son stress grâce à des outils et techniques simples et efficaces.",
  "objectifs": [
   "Identifier son objectif par rapport à sa gestion du stress",
   "Apprendre à identifier les mécanismes générateurs de stress pour mieux les prévenir",
   "Savoir gérer des situations stressantes grâce à une meilleure gestion des émotions et des techniques de communication adaptées"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "Coach très communicative et expressive. Elle a toujours su nous donner les meilleurs conseils, techniques, méthodes pour savoir gérer notre stress quotidien.",
   "role": "Customer Support Officer"
  }
 },
 {
  "slug": "gestion-de-crise",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/gestion-de-crise/",
  "titre": "Gestion de crise",
  "objectif": "Réussir à gérer une situation de crise.",
  "objectifs": [
   "Identifier son objectif par rapport à sa manière de gérer une situation de crise",
   "Observer et apprendre à identifier et gérer ses émotions pour maintenir sa lucidité et sa capacité à agir ou réagir",
   "Adopter la bonne posture et communication pour réussir à transformer la crise en opportunité"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Training vidéo",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "Écoute, efficacité, bons conseils… Ilana m’a accompagné pendant 1 année charnière. Cette rencontre m’a permis de faire un vrai gap professionnel, de prendre du recul et d’en apprendre énormément sur moi-même. Si vous avez l’opportunité de vous faire coacher, allez-y les yeux fermés !",
   "role": "Creative Director"
  }
 },
 {
  "slug": "organisation-et-gestion-des-priorites",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/organisation-gestion-des-priorites/",
  "titre": "Organisation et gestion des priorités",
  "objectif": "Réussir à bien gérer son temps et ses priorités pour maximiser son efficacité professionnelle.",
  "objectifs": [
   "Identifier son objectif par rapport à sa manière de gérer son temps et ses priorités",
   "Prendre conscience et lever les freins psychologiques et/ou pratiques empêchant la mise en place d’une bonne organisation et d’une bonne gestion des priorités",
   "Apprendre, notamment grâce à la matrice d’Eisenhower, à optimiser concrètement son organisation, pour gagner en efficience et réactivité"
  ],
  "methodes": [
   "Coaching",
   "Formation",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors",
   "Juniors"
  ],
  "durees": [
   4,
   6,
   8,
   10
  ],
  "avis": {
   "texte": "Ilana crée un espace sécurisant et chaleureux dans lequel on se sent immédiatement en confiance. Après avoir très rapidement cerné l’objet de nos inquiétudes, elle nous encourage à décortiquer ce problème, à le poser à plat et à trouver des solutions concrètes.",
   "role": "Events coordinator & Community Builder"
  }
 },
 {
  "slug": "carte-blanche",
  "famille": "Efficacité personnelle",
  "source": "https://scoache.com/formations/100-carte-blanche/",
  "titre": "100 % carte blanche",
  "objectif": "Accompagner le talent à déployer son plein potentiel par l’identification d’un objectif clair et l’émergence de pistes concrètes, orientées solution, pour l’atteindre.",
  "objectifs": [
   "Prendre de la hauteur pour faire face aux défis liés à son poste",
   "Prendre conscience des sujets sur lesquels progresser",
   "Faire émerger des solutions concrètes et actionnables dans son quotidien professionnel et dans la durée"
  ],
  "methodes": [
   "Coaching",
   "Mises en situation",
   "Livrables personnalisés"
  ],
  "public": [
   "Dirigeants",
   "Middle et top management",
   "Seniors"
  ],
  "durees": [
   6,
   8,
   10,
   12
  ],
  "avis": {
   "texte": "I had 6 coaching sessions with Ilana & highly recommend her. I appreciated the fact she is a great listener and tried to make the most of each session. She is result-driven & pragmatic. Thank you Ilana for your help & support.",
   "role": "Group Product Manager"
  }
 }
]''')

LARGEUR_PHOTO, HAUTEUR_PHOTO = 1101, 393
NOMBRES = {2: 'Deux', 3: 'Trois', 4: 'Quatre', 5: 'Cinq'}


def e(texte):
    return html.escape(texte, quote=True)


def ico(nom, taille=16):
    return (f'<svg class="ico" width="{taille}" height="{taille}" aria-hidden="true">'
            f'<use href="/assets/icones.svg#i-{nom}"/></svg>')


def heures(n):
    return f'{n} h'


def liste_fr(elements):
    if len(elements) == 1:
        return elements[0]
    return ', '.join(elements[:-1]) + ' ou ' + elements[-1]


def public_fr(public):
    mots = [public[0]] + [p[0].lower() + p[1:] for p in public[1:]]
    return ', '.join(mots)


def photo(slug):
    return f'/assets/formations/{slug}.jpg'


def autres(f):
    meme = [x for x in DONNEES if x['famille'] == f['famille']]
    i = next(k for k, x in enumerate(meme) if x['slug'] == f['slug'])
    return [meme[(i + k) % len(meme)] for k in range(1, 4)]


STYLE = """  <style>
    /* Fiches formations (formations/_generer.py) : en-tête « En bref » du hero, lignes empilées sur mobile. */
    .fo-hero-carte .fo-bref__haut { padding: 16px 20px 0; }
    @media (max-width: 900px) { .fo-hero-carte .fo-bref__haut { padding: 12px 12px 0; } }
    @media (max-width: 600px) { .fo-hero-carte .inst-ligne dt { flex-basis: auto; } }
  </style>"""

EVALUATION = [
    'Positionnement initial et objectif formulé par vous',
    'Indicateurs de progrès auto-évalués en début et en fin de parcours',
    'Validation par votre manager ou votre HRBP',
    'Questionnaire de satisfaction à chaud et à froid',
    'Attestation de fin de formation',
]


def page(f):
    titre = f['titre']
    durees = liste_fr([heures(n) for n in f['durees']])
    objectif = f['objectif']
    description = (f'Formation certifiée Qualiopi, {titre[0].lower() + titre[1:]} : '
                   f'{objectif[0].lower() + objectif[1:-1]}. Sessions individuelles de 1 h, '
                   f'en présentiel à Paris ou à distance.')

    objectifs = '\n'.join(
        f'''          <li class="carte">
            <span class="inst-num{' inst-num--noir' if i == 0 else ''}">{i + 1:02d}</span>
            <p>{e(o)}</p>
          </li>''' for i, o in enumerate(f['objectifs']))

    etapes = '\n'.join(
        f'''          <li class="fo-etape">
            <span class="inst-num{' inst-num--noir' if i == 0 else ''}">{i + 1:02d}</span>
            <div class="fo-etape__texte">
              <h3 class="fo-etape__titre">Parcours de {heures(n)}</h3>
              <p>{n} sessions individuelles de 1 h, à un rythme adapté à votre agenda.</p>
            </div>
          </li>''' for i, n in enumerate(f['durees']))

    methodes = '\n'.join(f'            <li>{e(m)}</li>' for m in f['methodes'])
    checks = '\n'.join(f'            <li>{ico("check")}{e(c)}</li>' for c in EVALUATION)
    etoiles = '\n'.join(f'              {ico("star", 14)}' for _ in range(5))

    cartes = '\n'.join(
        f'''          <li>
            <a class="fo-autre" href="/formations/{a['slug']}">
              <span class="photo fo-autre__photo"><img src="{photo(a['slug'])}" alt="" width="{LARGEUR_PHOTO}" height="{HAUTEUR_PHOTO}" loading="lazy"></span>
              <span class="fo-autre__texte"><span class="fo-autre__eyebrow">{e(a['famille'])}</span><span class="fo-autre__titre">{e(a['titre'])}</span></span>
              {ico("arrow")}
            </a>
          </li>''' for a in autres(f))

    nb = NOMBRES.get(len(f['durees']), str(len(f['durees'])))

    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titre)}, formation Scoaché</title>
  <meta name="description" content="{e(description)}">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/css/institutionnel.css">
{STYLE}
  <script>document.documentElement.classList.add('js');</script>
  <script src="/include.js" defer></script>
  <script src="/script.js" defer></script>
</head>
<body class="page-formation">
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="page">
  <div data-include="header"></div>

  <main id="contenu" tabindex="-1">
    <nav class="fil-ariane" aria-label="Fil d’Ariane">
      <ol>
        <li><a href="/">Accueil</a></li>
        <li><a href="/formations">Formations</a></li>
        <li>{e(f['famille'])}</li>
        <li aria-current="page">{e(titre)}</li>
      </ol>
    </nav>

    <!-- Hero -->
    <section class="section section--plateau" aria-labelledby="titre-page">
      <div class="plateau inst-hero">
        <div class="inst-hero__texte">
          <div class="inst-hero__intro">
            <p class="eyebrow eyebrow--lg">{e(f['famille'])}, formation certifiée Qualiopi</p>
            <h1 class="inst-titre-hero" id="titre-page">{e(titre)}</h1>
            <div class="fo-objectif">
              <span class="fo-objectif__label">Objectif</span>
              <span class="fo-objectif__texte">{e(objectif)}</span>
            </div>
            <div class="inst-hero__actions">
              <a class="btn btn--noir btn--lg" href="/nous-contacter">Nous contacter {ico("arrow", 18)}</a>
              <a class="link-caps" href="#programme">Voir le programme</a>
            </div>
          </div>
          <p class="inst-hero__preuve">{ico("star", 14)}4,9/5 sur Google, 94 % de satisfaction en 2025</p>
        </div>
        <div class="carte fo-hero-carte">
          <div class="photo"><img src="{photo(f['slug'])}" alt="" width="{LARGEUR_PHOTO}" height="{HAUTEUR_PHOTO}"></div>
          <div class="fo-bref__haut">
            <h2 class="fo-bref__titre">En bref</h2>
            <img src="/assets/qualiopi.png" alt="Qualiopi, processus certifié, République française" width="100" height="44">
          </div>
          <dl class="inst-lignes">
            <div class="inst-ligne"><dt>Durée</dt><dd>Parcours de {durees}</dd></div>
            <div class="inst-ligne"><dt>Sessions</dt><dd>Individuelles, de 1 h</dd></div>
            <div class="inst-ligne"><dt>Format</dt><dd>Présentiel à Paris ou distanciel</dd></div>
            <div class="inst-ligne"><dt>Public</dt><dd>{e(public_fr(f['public']))}</dd></div>
            <div class="inst-ligne"><dt>Tarif</dt><dd>Sur devis, selon la durée du parcours</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Objectifs pédagogiques -->
    <section class="section" aria-labelledby="titre-objectifs">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Objectifs pédagogiques</p>
          <h2 class="section-head__title" id="titre-objectifs">À l’issue du parcours, vous saurez</h2>
        </div>
      </div>
      <div class="plateau">
        <ul class="fo-objectifs">
{objectifs}
        </ul>
      </div>
    </section>

    <!-- Programme -->
    <section class="section" id="programme" aria-labelledby="titre-programme">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Programme</p>
          <h2 class="section-head__title" id="titre-programme">{nb} parcours, adaptés en durée et en fréquence</h2>
        </div>
      </div>
      <div class="plateau fo-programme-plateau">
        <ol class="carte fo-programme">
{etapes}
        </ol>
        <div class="carte fo-deroule">
          <h3 class="eyebrow inst-intertitre">Comment ça se passe</h3>
          <p>Sessions individuelles de 1 h, en présentiel à Paris ou à distance sur Zoom.</p>
          <p>Ateliers visuels et livrables construits avec vous sur Mural.</p>
          <p>Rendez-vous pris en autonomie sur Calendly.</p>
          <h3 class="eyebrow inst-intertitre inst-espace">Méthodes pédagogiques</h3>
          <p>Un parcours personnalisé, grâce à notre méthode qui mixe :</p>
          <ul class="inst-tags">
{methodes}
          </ul>
        </div>
      </div>
    </section>

    <!-- Évaluation et suivi -->
    <section class="section" aria-labelledby="titre-evaluation">
      <div class="section-head">
        <div class="section-head__text">
          <p class="eyebrow">Évaluation et suivi</p>
          <h2 class="section-head__title" id="titre-evaluation">Une progression mesurée, du début à la fin</h2>
        </div>
      </div>
      <div class="plateau plateau--colonne">
        <div class="fo-evaluation">
          <div class="carte inst-carte-pile">
            <h3 class="eyebrow inst-intertitre">Évaluation</h3>
            <ul class="inst-checks">
{checks}
            </ul>
          </div>
          <div class="inst-stat"><span class="inst-stat__valeur">94 %</span><span class="inst-stat__libelle">de satisfaction en 2025</span></div>
          <div class="inst-stat"><span class="inst-stat__valeur">4,9/5</span><span class="inst-stat__libelle">sur Google, plus de 85 avis</span></div>
        </div>
        <figure class="carte ap-avis__carte">
          <p class="etoiles" role="img" aria-label="5 étoiles sur 5">
{etoiles}
          </p>
          <blockquote><p>« {e(f['avis']['texte'])} »</p></blockquote>
          <figcaption class="temoin">
            <span class="temoin__texte">
              <span class="temoin__nom">{e(f['avis']['role'])}</span>
              <span class="temoin__role">Avis Google</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Tarif et accès -->
    <section class="section" aria-labelledby="titre-tarif">
      <h2 class="visually-hidden" id="titre-tarif">Tarif, prérequis et accessibilité</h2>
      <div class="plateau">
        <div class="fo-acces">
          <div class="carte">
            <h3 class="eyebrow inst-intertitre">Tarif</h3>
            <p class="fo-tarif">Sur devis</p>
            <p>Proposition chiffrée envoyée sous 48 h. Finançable par votre OPCO dans le cadre du plan de développement des compétences.</p>
            <a class="btn btn--noir" href="/nous-contacter">Nous contacter {ico("arrow")}</a>
          </div>
          <div class="carte">
            <h3 class="eyebrow inst-intertitre">Prérequis</h3>
            <p>Aucun. Un entretien de positionnement précède chaque parcours pour l’adapter à votre niveau et à votre contexte.</p>
            <h3 class="eyebrow inst-intertitre inst-espace">Délai d’accès</h3>
            <p>Démarrage sous 2 à 4 semaines après validation du devis ou accord de prise en charge.</p>
          </div>
          <div class="carte">
            <h3 class="eyebrow inst-intertitre">Accessibilité</h3>
            <p>Nos formations sont accessibles aux personnes en situation de handicap. Contactez notre référente handicap pour étudier ensemble les adaptations nécessaires : rythme, format, supports.</p>
            <a class="link-caps" href="/accessibilite#referente-handicap">Contacter la référente handicap</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Les autres formations -->
    <section class="section section--serre" aria-labelledby="titre-autres">
      <h2 class="eyebrow fo-autres-titre" id="titre-autres">Autres formations en {e(f['famille'].lower())}</h2>
      <div class="plateau">
        <ul class="fo-autres">
{cartes}
        </ul>
      </div>
    </section>

    <div data-include="contact"></div>
  </main>

  <div data-include="footer"></div>
</div>
</body>
</html>
'''


def main():
    for f in DONNEES:
        assert os.path.exists(os.path.join(RACINE, photo(f['slug']).lstrip('/'))), f['slug']
        chemin = os.path.join(RACINE, 'formations', f['slug'] + '.html')
        contenu = page(f)
        for interdit in ('\u00b7', '\u2022', '\u25be'):
            assert interdit not in contenu, (f['slug'], interdit)
        with open(chemin, 'w', encoding='utf-8') as sortie:
            sortie.write(contenu)
        print('formations/' + f['slug'] + '.html')


if __name__ == '__main__':
    main()
