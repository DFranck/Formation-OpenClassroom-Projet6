attributs ARIA # utilisez KeyboardEvent.key

Prototype des fonctionnalités :
Nous devons créer les pages suivantes pour le prototype :
● Page d'accueil :
○ Liste de tous les photographes avec leur nom, leur slogan, leur
localisation, leur prix/heure et une image miniature de leur choix.
○ Lorsque l'utilisateur clique sur la vignette d'un photographe, il est
amené à sa page.
● Page des photographes (le contenu de la page sera généré de manière
dynamique en fonction du photographe) :
○ Affiche une galerie des travaux du photographe.
○ Les photographes peuvent montrer à la fois des photos et des vidéos.
■ Dans le cas des vidéos, montrer une image miniature dans la
galerie.
○ Chaque média comprend un titre et un nombre de likes.
■ Lorsque l'utilisateur clique sur l'icône "Like", le nombre de likes
affiché est incrémenté.
■ Le nombre de likes total d’un photographe doit correspondre à la
somme des likes de chacun de ses médias.aw
○ Les médias peuvent être triés par popularité ou par titre.
○ Lorsque l'utilisateur clique sur un média, celui-ci doit s’ouvrir dans une
lightbox :
■ Lorsque la lightbox est affichée, il y a une croix dans le coin pour
fermer la fenêtre.
■ Des boutons de navigation permettent de passer d'un élément
média à l'autre dans la lightbox (les utilisateurs peuvent cliquer
sur ces boutons pour naviguer).
■ Les touches fléchées du clavier permettent également de
naviguer entre les médias dans la lightbox.
○ Afficher un bouton pour contacter le photographe.
■ Le formulaire de contact est une modale qui s'affiche par-dessus
le reste.
■ Il comprend des champs pour les noms, l'adresse électronique et
le message.
■ Plus tard, le bouton de contact enverra un message au
photographe. Pour l'instant, seulement afficher le contenu des
trois champs dans les logs de la console.

Le code devrait passer les tests AChecker sans “known issue” (afin qu'il soit
conforme aux WCAG).
