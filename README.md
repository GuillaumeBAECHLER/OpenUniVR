# OpenUniVR
----------

> L’accès à distance aux écoles et l’accès à des salles de cours pour les élèves de MOOC.

## Le projet OpenUniVR
----------

À l’origine du projet OpenUniVR se trouve la volonté de création d’une ***université virtuelle*** en soutient aux ***MOOC*** mais aussi permettant ***un accès à distance à l’école***. Cette plateforme aurait pour but principal de **faciliter le rapprochement des étudiants et l’accès à des cours très interactifs et gamifiés**.

Pour l'interactivité et la gamification la possibilité de manier des objets 3D donne une nouvelle dimension à l'éducation. Des jeux de team building ou encore une escape room avec des énigmes autour d'un sujet précis, permettant de découvrir tout en s'amusant, serons à l'honneur.

## La solution
----------

### La technique

Principalement en VR, un **POC** sera réalisé en utilisant la technologie Open-Source **A-Frame** qui utilise WebVR à travers la libraire Three.js.
Le choix d’A-Frame c’est fait par une naturelle appétence de notre équipe à participer à des projets Open-Sources, notamment en offrant un exemple de Use Case concret. Le langage de programmation principalement utilisé pour réaliser le POC sera donc JavaScript.

Avec un Front en JavaScript et un ensemble de technologies WebVR à appréhender, nous en avons conclu que l’utilisation d’un serveur **Node.js** nous permettrait de gagner en rapidité d’intégration, notamment grâce au gestionnaire de paquets NPM. Ce serveur permettra de servir l’application Front ainsi que de gérer les connexions et la persistance des données.

La gestion des connexions temps réels des différents utilisateurs de la plateforme a été un deuxième axe de réflexion majeur. La solution qui nous semblait idéal réside sous le nom de **Socket.IO**, librairie JavaScript permettant une communication en temps réel, bidirectionnelle et événementielle. Elle fonctionne sur toutes les plates-formes, tous les navigateurs et tous les appareils, en mettant l'accent sur la fiabilité et la rapidité.

Concernant la persistance des données, nous avons choisi l’intégration de deux bases de données : 
-	L’utilisation de Redis pour le système de messagerie intégré à l’application, qui se doit d’être à accès rapide. Nous utiliserons également **Redis** pour la gestion des caches sessions.
-	Un RDBMS comme **MariaDB** pour la persistance des autres types de données, comme la gestion des comptes par exemple.

### Les spécifications graphiques

TODO

### La gestion du projet

TODO