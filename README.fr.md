# Password Manager

Cette application est un gestionnaire de mots de passe sécurisé qui utilise l'algorithme AES-256-GCM pour encrypter vos données sensibles avant de les stocker localement. Il utilise une méthode d'encryption forte, est simple d'utilisation, permet l'accès rapide à tous vos comptes, et peut également générer des mots de passe sécurisés.

Pour lire le README en anglais, suivez ce lien : [README.md](README.md)

## Fonctionnalités

- Fichiers encryptés par l'algorithme AES-256-GCM
- Prise en charge de plusieurs utilisateurs avec un accès sécurisé
- Verrouillage automatique contre les tentatives de force brute
- Fermeture de session automatique après 15 minutes d'inactivité
- Générateur de mots de passe avancé pour des mots de passe forts et sécurisés
- Indicateur de force des mots de passe dans les formulaires
- Import et export des données brutes vers un fichier CSV
- Recherche rapide des comptes et actions rapides améliorant l'expérience utilisateur
- Bascule entre un mode sombre et un mode clair

## Développement

Ce projet est développé avec TypeScript, React, et Material UI. L'API Web Crypto est utilisée pour l'encryption sécurisée des données, et Tauri est utilisé pour le support d'applications de bureau légères et multiplateformes.

J'apprécie vos retours si vous souhaitez partager votre expérience et signaler tout problème.

## Utilisation

### Option 1 : Télécharger l'installateur

Vous pouvez télécharger la dernière version de l'installateur depuis [la page de la dernière version](https://github.com/LaurentP/password-manager/releases).

Il s'agit d'une application de bureau multiplateforme. Si vous ne trouvez pas l'installateur correspondant à votre système d'exploitation, référez-vous à l'option 2.

### Option 2 : Compiler depuis le code source

#### 1. Configurer votre environnement

Node.js est l'environnement nécessaire pour compiler l'application. Si vous ne l'avez pas déjà installé sur votre ordinateur, téléchargez-le depuis [le site de Node.js](https://nodejs.org) avant de suivre les étapes suivantes.

En complément de Node.js, ce projet qui utilise Tauri a également des prérequis supplémentaires. Référez-vous à [cette page de la documentation de Tauri](https://tauri.app/fr/v1/guides/getting-started/prerequisites) pour configurer votre environnement avant de continuer.

#### 2. Télécharger le code source

Téléchargez le code source en clonant le dépôt ou en téléchargeant le fichier ZIP depuis la page GitHub du projet. Ensuite, dans votre terminal, assurez-vous de naviguer à la racine du dossier du projet avant d'utiliser les commandes suivantes.

#### 3. Installer les dépendances

```shell
npm install
```

#### 4. Compiler l'application

```shell
npm run tauri build
```

Cela va générer les fichiers binaires correspondants à votre système d'exploitation pour installer l'application.

## Licence

Ce projet est sous la licence MIT. Consultez le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

L'icône principale de l'application provient de [Freepik](https://freepik.com).

## Captures d'écran

![Accounts](/screenshots/screenshot-1.png)
![Password Generator](/screenshots/screenshot-2.png)
![Settings](/screenshots/screenshot-3.png)
