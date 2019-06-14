# OpenUniVR

> L’accès à distance aux écoles et l’accès à des salles de cours pour les élèves de MOOC.

## Le projet OpenUniVR

À l’origine du projet OpenUniVR se trouve la volonté de création d’une ***université virtuelle*** en soutient aux ***MOOC*** mais aussi permettant ***un accès à distance à l’école***. Cette plateforme aurait pour but principal de **faciliter le rapprochement des étudiants et l’accès à des cours très interactifs et gamifiés**.

Pour l'interactivité et la gamification la possibilité de manier des objets 3D donne une nouvelle dimension à l'éducation. Des jeux de team building ou encore une escape room avec des énigmes autour d'un sujet précis, permettant de découvrir tout en s'amusant, serons à l'honneur.

## La solution

### La technique

Principalement en VR, un **POC** sera réalisé en utilisant la technologie Open-Source **A-Frame** qui utilise WebVR à travers la libraire Three.js.
Le choix d’A-Frame c’est fait par une naturelle appétence de notre équipe à participer à des projets Open-Sources, notamment en offrant un exemple de Use Case concret. Le langage de programmation principalement utilisé pour réaliser le POC sera donc JavaScript.

Avec un Front en JavaScript et un ensemble de technologies WebVR à appréhender, nous en avons conclu que l’utilisation d’un serveur **Node.js** nous permettrait de gagner en rapidité d’intégration, notamment grâce au gestionnaire de paquets NPM. Ce serveur permettra de servir l’application Front ainsi que de gérer les connexions et la persistance des données.

La gestion des connexions temps réels des différents utilisateurs de la plateforme a été un deuxième axe de réflexion majeur. La solution qui nous semblait idéal réside sous le nom de **Socket.IO**, librairie JavaScript permettant une communication en temps réel, bidirectionnelle et événementielle. Elle fonctionne sur toutes les plates-formes, tous les navigateurs et tous les appareils, en mettant l'accent sur la fiabilité et la rapidité.

Concernant la persistance des données, nous avons choisi l’intégration de deux bases de données : 
-	L’utilisation de Redis pour le système de messagerie intégré à l’application, qui se doit d’être à accès rapide. Nous utiliserons également **Redis** pour la gestion des caches sessions.
-	Un RDBMS comme **MariaDB** pour la persistance des autres types de données, comme la gestion des comptes par exemple.

Pour la partie modélisation 3D, nous utiliserons le logiciel Open-Source **Blender**. Le gros avantage de cet outil est la grande communauté de développeur le soutenant, ce qui lui a permis de se doter de l’ensemble des fonctionnalités requises par l’industrie des jeux vidéo et du cinéma d’animation. Ainsi les tâches de modélisation 3D, Texturing et Animation seront principalement réalisées sur cet outil.

### Interactions entre les élèves

-	Chat entre élève inscrits au même cours
-	Possibilité d’envoyer une invitation à un cours
-	Possibilité d’échanger des fichiers


### Les spécifications graphiques

TODO

### La gestion du projet

TODO

## Getting started

Pour commencer il vous faut un environnement [Node.js](https://nodejs.org/en/).

Si vous n'utilisez pas encore [Git](https://git-scm.com/)... c'est le moment de s'y mettre !
Si vous débutez avec Git, un tutoriel sympa est dispo [ici](https://learngitbranching.js.org/), et si vous avez le temps, c'est pas mal les [SSH Keys](https://docs.gitlab.com/ee/ssh/) !
Si vous souhaitez signer vos commits, direction les [GPG Keys](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/).

### Le front

```bash
# si vous utilisez les ssh keys :
$ git clone git@gitlab.com:GuillaumeBAECHLER/openunivr.git
#  sinon avec https :
$ git clone https://gitlab.com/GuillaumeBAECHLER/openunivr.git
$ cd openunivr
$ npm i
# ou avec Yarn :
$ yarn
# Installer Parcel en global
$ npm install -g parcel-bundler
# ou avec Yarn :
$ yarn global add parcel-bundler
```

Pour dev :

```bash
$ npm run dev
# ou avec Yarn :
$ yarn dev
```

### Le serveur

Il vous faudra une base de données MariaDB et un Redis, le plus simple est d'utiliser docker mais vous pouvez faire comme bon vous semble ...

```bash
docker run --name open_univer_mariadb -e MYSQL_ROOT_PASSWORD=secret_password -p 3306:3306 -d mariadb

docker run --name open_univer_redis -p 6379:6379 -d redis
```

Installez aussi [MySQLWorbench](https://dev.mysql.com/downloads/workbench/).

Connectez vous à votre base de données.

Si vous utilisez docker toolbox (windows != windows 10 pro), vous pourrez trouver l'IP de votre VM Host Docker grâce à la commande :

```bash
docker-machine ip
```

Créez un nouveau schéma que vous nommerez openunivr, puis créez la table account :

```sql
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `lastname` varchar(60) NOT NULL,
  `firstname` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(16) NOT NULL,
  `connection_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
```

Si vous utilisez Docker Toolbox, des changements d'IP (remplacer l'IP ou le Hostname par l'IP de votre VM Host Docker) sont nécéssaires dans server.js (lignes 15 et 145) puis dans le main.js (ligne 8).

Lancez ensuite la commande `npm run build` après les modifications.

Il faut maintenant lancer le serveur, avec node :
```bash
cd ./server
node server.js
```

BRAVO !! Maintenant, en tapant l'adresse IP renseignée dans les fichiers précédents avec le port 3000 (192.168.x.x:3000) tu auras l'accès à une application impressionnante !