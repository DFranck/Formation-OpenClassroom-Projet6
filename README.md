attributs ARIA # utilisez KeyboardEvent.key

---

tri

##Créer le bouton et la div pour le menu déroulant: Comme vous l'avez mentionné, vous pouvez utiliser un bouton pour déclencher l'affichage du menu et une div pour contenir les options.

Gérer l'affichage du menu: Vous pouvez utiliser un gestionnaire d'événements pour afficher ou masquer le menu lorsque l'utilisateur clique sur le bouton. Vous pouvez aussi ajouter un événement de "blur" ou "focusout" pour masquer le menu lorsque l'utilisateur clique en dehors du bouton ou du menu.

Créer les options de tri: Vous pouvez ajouter des éléments (par exemple, des divs ou des liens) à la div du menu pour représenter les différentes options de tri.

Mettre à jour le contenu de la galerie: Lorsqu'une option est sélectionnée, vous pouvez utiliser JavaScript pour mettre à jour le contenu de la galerie en fonction de l'option choisie. Vous pouvez également mettre à jour le texte du bouton pour refléter l'option sélectionnée.

Styliser le menu: Vous pouvez utiliser CSS pour styliser le bouton et le menu déroulant comme vous le souhaitez, y compris en ajoutant des icônes Font Awesome ou autres pour les flèches.

---

Prototype des fonctionnalités :
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
