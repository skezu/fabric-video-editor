## Introduction

### Aperçu

Cette documentation fournit un guide complet du fonctionnement interne d'un éditeur vidéo simplifié, inspiré de Capcut, construit à l'aide de React, Fabric.js et FFMPEG.wasm. Notre éditeur permet aux utilisateurs d'assembler des clips vidéo, des images, de l'audio et du texte, d'appliquer des effets visuels et des animations, et enfin d'exporter leurs créations sous forme de vidéo cohérente.

### Public cible

Cette documentation s'adresse aux développeurs ayant une solide compréhension de React et des concepts de développement Web front-end. Une familiarité avec le canevas HTML5 et les principes de base du montage vidéo sera bénéfique.

### Fonctionnalités clés

- **Montage basé sur une timeline :** Organisez les médias et les éléments sur une timeline visuelle pour dicter leur séquence et leur durée.
- **Prise en charge multimédia :** Incorporez des clips vidéo, des images, des pistes audio et des éléments de texte dans vos projets.
- **Effets visuels et filtres :** Améliorez vos médias avec une variété d'effets visuels (par exemple, noir et blanc, sépia) pour obtenir le style souhaité.
- **Animations :** Donnez vie à vos montages en ajoutant des animations telles que des fondus d'entrée, des fondus de sortie, des glissements d'entrée et des glissements de sortie à vos éléments.
- **Recadrage personnalisé :** Ajustez finement le cadrage de votre contenu vidéo et image à l'aide d'un outil de recadrage convivial.
- **Exporter en vidéo :** Générez une sortie vidéo finale intégrant tous les montages, effets et animations.

## 2. Prise en main

Cette section vous guide à travers la configuration de Fabric Video Editor sur votre machine locale.

### Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js et npm :** Le projet repose sur Node.js pour son environnement d'exécution JavaScript et sur npm (Node Package Manager) pour la gestion des dépendances. Téléchargez et installez les versions appropriées pour votre système d'exploitation à partir de [https://nodejs.org/](https://nodejs.org/).
- **Git :** Nous allons cloner le référentiel du projet depuis GitHub, il est donc essentiel d'avoir Git installé. Téléchargez-le et installez-le à partir de [https://git-scm.com/](https://git-scm.com/).

### Installation

1. **Cloner le référentiel :**
   - Ouvrez votre terminal ou votre invite de commande.
   - Accédez au répertoire où vous souhaitez cloner le projet.
   - Exécutez la commande suivante : 
     ```bash
     git clone https://github.com/your-username/fabric-video-editor.git 
     ```
   - **Remarque :** Remplacez `your-username/fabric-video-editor.git` par l'URL réelle du référentiel GitHub que vous obtenez de Christophe.

2. **Accédez au répertoire du projet :**
   ```bash
   cd fabric-video-editor 
   ```

3. **Installer les dépendances :**
   ```bash
   npm install 
   ```
   Cette commande lit le fichier `package.json` et installe toutes les dépendances nécessaires au projet.

### Exécution du serveur de développement

Une fois l'installation terminée :

1. **Démarrez le serveur :**
   ```bash
   npm run dev
   ```

2. **Accès dans le navigateur :**
   - Ouvrez votre navigateur Web et accédez à [http://localhost:3000](http://localhost:3000) (ou le port spécifié dans la sortie de votre terminal). Vous devriez voir l'interface de Fabric Video Editor.

### Débogage

Visual Studio Code (VS Code) offre une configuration de débogage pratique :

1. **Exécutez le serveur de développement :** Assurez-vous que le serveur est en cours d'exécution avec `npm run dev`.

2. **Débogueur VS Code :**
   - Dans VS Code, accédez à l'onglet "Exécuter et déboguer" (généralement accessible en cliquant sur l'icône de bogue dans la barre latérale gauche).
   - Cliquez sur "Exécuter et déboguer" et sélectionnez "Lancer Chrome contre localhost" (ou votre navigateur préféré). 

   Cela lancera une nouvelle fenêtre de navigateur attachée au débogueur VS Code, vous permettant de définir des points d'arrêt et d'inspecter votre code pendant l'exécution.

## 3. Concepts fondamentaux

Cette section présente les concepts fondamentaux de Fabric Video Editor, en fournissant une compréhension claire de la façon dont les éléments multimédias sont gérés, manipulés et présentés dans l'éditeur.

### 3.1 Éléments de l'éditeur : les blocs de construction de votre vidéo

Au cœur de l'éditeur se trouve le concept d'**éléments de l'éditeur**. Ces éléments représentent les composants multimédias individuels qui constituent votre projet vidéo. Il existe quatre types principaux :

- **Éléments vidéo (`VideoEditorElement`) :** Ces éléments encapsulent des clips vidéo, gérant des propriétés telles que la source vidéo (`src`), la position de lecture actuelle, les effets visuels appliqués et les limites de recadrage personnalisées.

- **Éléments d'image (`ImageEditorElement`) :**  Les éléments d'image représentent des images statiques, stockant la source de l'image (`src`) et tous les effets visuels appliqués.

- **Éléments audio (`AudioEditorElement`) :** Les éléments audio gèrent les pistes audio, stockant la source audio (`src`) et contrôlant la lecture.

- **Éléments de texte (`TextEditorElement`) :**  Les éléments de texte vous permettent de superposer du texte à la vidéo. Ils gèrent des propriétés telles que le contenu du texte, la taille de la police, l'épaisseur de la police et le positionnement.

Chaque élément de l'éditeur, quel que soit son type, partage un ensemble commun de propriétés qui régissent son comportement et son apparence dans l'éditeur :

- **`id` (Lecture seule, `string`) :** Un identifiant unique généré pour chaque élément.
- **`fabricObject` (Facultatif, `fabric.Object`) :** Une référence à l'objet Fabric.js correspondant représentant cet élément sur le canevas.  Cela permet la manipulation visuelle.
- **`name` (`string`) :** Un nom convivial pour l'élément, le rendant identifiable dans l'interface de l'éditeur.
- **`type` (Lecture seule, `string`) :** Spécifie le type de l'élément ("vidéo", "image", "audio" ou "texte").
- **`placement` (`Placement`) :**  Contrôle le positionnement, la taille, la rotation et la mise à l'échelle de l'élément sur le canevas. (Voir la section 3.3 pour en savoir plus sur `Placement`)
- **`timeFrame` (`TimeFrame`) :**  Définit les heures de début et de fin de l'élément sur la timeline.  (Voir la section 3.2 pour plus de détails sur `TimeFrame`)
- **`elementCurrentTime` (`number`) :**  Suit le temps de lecture actuel (en millisecondes) dans le média de l'élément.
- **`properties` (Le type varie) :**  Contient les propriétés spécifiques à l'élément (par exemple, `src` pour la vidéo/l'image/l'audio, `text` pour les éléments de texte).

### 3.2 Timeline et TimeFrame : orchestration de la séquence de votre vidéo

La **Timeline** est le cœur de l'éditeur vidéo, fournissant une représentation visuelle de la structure de votre vidéo au fil du temps. Elle dicte quand chaque élément apparaît, disparaît et combien de temps il dure.

Le concept de **TimeFrame**, représenté par le type `TimeFrame`, est au cœur de la fonctionnalité de la timeline :

- **`start` (`number`) :**  Le point dans le temps (en millisecondes) sur la timeline où l'élément doit commencer à être visible ou audible.
- **`end` (`number`) :**  Le temps (en millisecondes) sur la timeline où l'élément doit se terminer.
- **`relativeStart` (`number`) :**  Pour les éléments vidéo et audio, cela stocke le point de départ (en millisecondes) dans le média d'origine à partir duquel la lecture doit commencer. Utile lorsque vous souhaitez uniquement inclure une partie d'un fichier vidéo ou audio plus long.

Les propriétés `start` et `end` déterminent la durée d'un élément sur la timeline. `relativeStart` offre un contrôle plus fin sur la lecture multimédia.

La représentation visuelle de la timeline vous permet de :

- **Faire glisser des éléments** pour modifier leur position dans la séquence.
- **Redimensionner des éléments** pour modifier leur durée.
- **Diviser des éléments** pour les couper en plusieurs segments.

### 3.3 Placement et manipulation : positionnement des éléments sur le canevas

Le type `Placement` dicte la manière dont les éléments de l'éditeur sont disposés et manipulés spatialement sur le canevas Fabric.js.  Il englobe les propriétés suivantes :

- **`x` (`number`) :**  La coordonnée x du coin supérieur gauche de l'élément sur le canevas.
- **`y` (`number`) :**  La coordonnée y du coin supérieur gauche de l'élément sur le canevas.
- **`width` (`number`) :** La largeur d'affichage de l'élément sur le canevas.
- **`height` (`number`) :** La hauteur d'affichage de l'élément sur le canevas.
- **`cropX` (Facultatif, `number`) :** Pour un recadrage personnalisé, la coordonnée x du coin supérieur gauche de la zone de recadrage par rapport à l'élément.
- **`cropY` (Facultatif, `number`) :** Pour un recadrage personnalisé, la coordonnée y du coin supérieur gauche de la zone de recadrage par rapport à l'élément.
- **`cropWidth` (Facultatif, `number`) :** La largeur de la zone de recadrage personnalisée.
- **`cropHeight` (Facultatif, `number`) :** La hauteur de la zone de recadrage personnalisée.
- **`rotation` (`number`) :** L'angle (en degrés) de rotation de l'élément.
- **`scaleX` (`number`) :** Le facteur d'échelle horizontal de l'élément (1 représente la largeur d'origine).
- **`scaleY` (`number`) :** Le facteur d'échelle vertical de l'élément (1 représente la hauteur d'origine).

En modifiant ces propriétés, vous pouvez positionner, redimensionner, faire pivoter, recadrer et mettre à l'échelle avec précision les éléments sur le canevas pour obtenir la disposition visuelle souhaitée.

Cette exploration détaillée des concepts fondamentaux fournit une base pour comprendre la structure et les fonctionnalités de Fabric Video Editor. 

## 4. Décomposition des composants

Cette section explore les composants clés qui composent Fabric Video Editor, en expliquant leurs rôles, leurs fonctionnalités et leurs interactions au sein de l'application.

### 4.1 Store.ts (MobX Store) : la source unique de vérité

Le fichier `Store.ts` héberge le magasin MobX, qui agit comme référentiel de données central et centre logique pour l'ensemble de l'application. Ses propriétés contiennent l'état de l'éditeur, et ses méthodes fournissent des moyens de mettre à jour et de manipuler cet état.  

Décomposons les éléments clés de `Store.ts` :

**Propriétés :**

- **`canvas` (`fabric.Canvas | null`) :**  Une référence à l'instance du canevas Fabric.js, donnant accès aux méthodes de manipulation du canevas. 
- **`backgroundColor` (`string`) :**  Stocke la couleur d'arrière-plan du canevas.
- **`selectedMenuOption` (`MenuOption`) :**  Suit l'option de menu actuellement sélectionnée ("Vidéo", "Audio", "Texte", etc.), influençant le panneau de ressources affiché.
- **`audios` (`string[]`) :** Un tableau d'URL pointant vers les ressources audio chargées.
- **`videos` (`string[]`) :**  Un tableau d'URL représentant les ressources vidéo chargées.
- **`images` (`string[]`) :**  Un tableau d'URL pointant vers les ressources d'images chargées.
- **`editorElements` (`EditorElement[]`) :**  Le cœur de l'éditeur !  Ce tableau stocke tous les éléments de l'éditeur (vidéo, image, audio, texte) qui ont été ajoutés à la timeline.
- **`selectedElement` (`EditorElement | null`) :** Contient une référence à l'élément de l'éditeur actuellement sélectionné, permettant une manipulation ciblée.
- **`maxTime` (`number`) :**  La durée maximale (en millisecondes) de la timeline.
- **`animations` (`Animation[]`) :**  Un tableau pour stocker les animations appliquées aux éléments de l'éditeur.
- **`animationTimeLine` (`anime.AnimeTimelineInstance`) :** Une instance de la timeline Anime.js pour gérer et lire les animations.
- **`playing` (`boolean`) :**  Indique si la lecture de l'éditeur est active ou en pause.
- **`currentKeyFrame` (`number`) :** Représente l'image actuelle de la timeline pendant la lecture, utilisée pour synchroniser les éléments et les animations.
- **`fps` (`number`) :**  Les images par seconde pour la lecture.
- **`canvasInitialized` (`boolean`) :**  Un indicateur indiquant si le canevas Fabric.js a été initialisé.

**Méthodes :**

- **`setSelectedMenuOption(selectedMenuOption: MenuOption)` :**  Met à jour la propriété `selectedMenuOption`, contrôlant quel panneau de ressources est affiché.
- **`setCanvas(canvas: fabric.Canvas | null)` :**  Définit la propriété `canvas` une fois que le canevas Fabric.js est initialisé.
- **`setBackgroundColor(backgroundColor: string)` :**  Modifie la couleur d'arrière-plan du canevas.
- **`addVideoResource, addAudioResource, addImageResource` :** Méthodes pour ajouter des ressources aux tableaux respectifs.
- **`addEditorElement(editorElement: EditorElement)` :** Ajoute un nouvel élément de l'éditeur (vidéo, audio, image ou texte) au tableau `editorElements`, l'ajoutant efficacement à la timeline.
- **`removeEditorElement(id: string)` :**  Supprime un élément de l'éditeur de la timeline.
- **`updateEditorElement(editorElement: EditorElement)` :**  Met à jour les propriétés d'un élément de l'éditeur existant.
- **`setPlaying(playing: boolean)` :** Démarre ou arrête la boucle de lecture de l'éditeur.
- **`updateTimeTo(newTime: number)` :**  Recherche la timeline à un moment précis, en mettant à jour la visibilité des éléments et les positions de lecture.
- **`refreshElements()` :** Une méthode cruciale qui réaffiche et met à jour les éléments sur le canevas Fabric.js chaque fois qu'il y a des changements dans le tableau `editorElements`.
- **`splitElement(id: string, splitTime: number)` :**  Divise un élément existant en deux au `splitTime` spécifié.
- **`saveCanvasToVideoWithAudio()` :**  Gère le processus d'exportation, capturant le contenu du canevas avec l'audio et générant la sortie vidéo finale.

### 4.2 Principaux composants de l'interface utilisateur : l'interface utilisateur

- **`Editor.tsx` :**  Le composant racine qui initialise le canevas Fabric.js, configure les écouteurs d'événements et affiche d'autres composants tels que `Resources`, `ElementsPanel`, `Menu`, `TimeLine` et `ContextMenu`. Il agit comme conteneur principal pour l'interface de l'éditeur.

- **`TimeLine.tsx` :** Ce composant est responsable de la représentation visuelle de la timeline, y compris les positions et les durées des éléments de l'éditeur. Il gère les interactions de l'utilisateur telles que le déplacement d'éléments pour modifier leur ordre, le redimensionnement d'éléments pour modifier leurs durées et la division d'éléments à des points spécifiques dans le temps.

- **`Resources.tsx` :**  Affiche dynamiquement différents panneaux de ressources en fonction de la `selectedMenuOption` du magasin MobX. 

- **`Element.tsx` :**  Représente un élément de l'éditeur individuel dans le `ElementsPanel`. Il affiche un aperçu de l'élément (par exemple, une miniature pour les vidéos et les images, une icône pour l'audio et le texte) ainsi que son nom. Les utilisateurs peuvent sélectionner des éléments ici pour les manipuler sur la timeline.

### 4.3 Fonctions utilitaires : aides et abstractions

- **`fabric-utils.ts` :** Contient des classes Fabric.js personnalisées et des fonctions utilitaires qui étendent les fonctionnalités de base de la bibliothèque. Par exemple, cela peut inclure des classes personnalisées pour la gestion des éléments vidéo et image (`CoverVideo` et `CoverImage`) avec des fonctionnalités supplémentaires telles que le recadrage personnalisé et les effets. 

Comprendre cette décomposition des composants est essentiel pour naviguer dans le code et comprendre comment les différentes parties de l'application collaborent pour créer un éditeur vidéo fonctionnel.


## 5. Recadrage personnalisé

Fabric Video Editor fournit un mécanisme de recadrage personnalisé des éléments vidéo et image, offrant aux utilisateurs un contrôle précis sur la partie visible de leurs médias. Cette fonctionnalité est principalement mise en œuvre via une combinaison du composant `ReframeModal` et des propriétés personnalisées dans les types `EditorElement` et `Placement`, ainsi que des fonctions utilitaires dans `fabric-utils.ts`.

### 5.1 Le mécanisme : de l'interaction de l'utilisateur à la mise à jour du canevas

Voici une ventilation étape par étape du fonctionnement du recadrage personnalisé :

1. **Déclenchement du `ReframeModal` :** 
   - L'utilisateur peut lancer le recadrage en interagissant avec un élément d'interface utilisateur désigné, probablement dans le composant `Element.tsx` ou un bouton/option "Recadrer" dédié associé à l'élément sélectionné.
   - Cette interaction mettra généralement à jour une variable d'état dans un composant (par exemple, `Editor.tsx`) pour contrôler la visibilité du `ReframeModal`.

2. **`ReframeModal` (`ReframeModal.tsx`) :**
   - Ce composant modal fournit l'interface de recadrage. Il reçoit l'`EditorElement` sélectionné (`element`) en tant que prop.
   - À l'intérieur du modal :
     - Le composant `ReactCrop` est utilisé pour sélectionner visuellement une zone de recadrage sur l'aperçu du média.
     - L'utilisateur peut choisir un rapport hauteur/largeur fixe pour le recadrage (par exemple, 16:9, 9:16).
     - Pour les vidéos, il existe une option de "Recadrage automatique" à l'aide d'une API de suivi du visage.

3. **Application du recadrage (mise à jour d'`EditorElement` et `Placement`) :**
   - Lorsque l'utilisateur est satisfait de sa sélection et clique sur "Appliquer", la fonction `handleApplyReframe` dans `ReframeModal` est exécutée.
   - Cette fonction effectue les opérations suivantes :
     - Calcule les limites de recadrage par rapport aux dimensions d'origine du média à l'aide de `calculatePixelCrop`.
     - Met à jour la propriété `placement` de l'`EditorElement` sélectionné :
       - `cropX`, `cropY`, `cropWidth` et `cropHeight` sont définis dans l'objet `Placement` pour stocker les coordonnées et les dimensions du recadrage.
       - La `width` et la `height` de l'élément peuvent également être ajustées en fonction du recadrage et des dimensions du canevas pour garantir un affichage correct.
   - Le modal se ferme et les modifications apportées au `placement` de l'`EditorElement` déclenchent un nouveau rendu.

4. **Mise à jour du canevas (`refreshElements`) :**
   - Les modifications apportées à l'`EditorElement` sont reflétées dans le magasin MobX, déclenchant une mise à jour du canevas via la méthode `refreshElements` dans `Store.ts`.
   - **`fabric-utils.ts` (`CoverImage`/`CoverVideo`) :**
     -  Ces classes Fabric.js personnalisées (si implémentées comme décrit dans la section précédente) sont cruciales pour appliquer le recadrage à la représentation visuelle de l'élément sur le canevas. 
     -  Elles utilisent les valeurs `cropX`, `cropY`, `cropWidth` et `cropHeight` de l'objet `Placement` mis à jour dans leurs méthodes `_render` pour dessiner uniquement la partie sélectionnée du média sur le canevas.

5. **Sortie finale :**
   - Lorsque l'utilisateur exporte la vidéo à l'aide de `saveCanvasToVideoWithAudio()`, les paramètres de recadrage sont pris en compte pendant le processus de génération vidéo. Cela garantit que la vidéo exportée n'inclut que la partie recadrée des éléments multimédias.

### 5.2 Variables et fonctions clés :

- **`element.placement` (`Placement`) :** Stocke les informations de recadrage (`cropX`, `cropY`, `cropWidth`, `cropHeight`) pour un élément de l'éditeur.
- **`calculatePixelCrop` (`ReframeModal.tsx`) :**  Convertit les pourcentages de recadrage de `ReactCrop` en valeurs de pixels par rapport au média d'origine.
- **`handleApplyReframe` (`ReframeModal.tsx`) :** Met à jour le `placement` de l'`EditorElement` avec les nouvelles valeurs de recadrage.
- **`refreshElements` (`Store.ts`) :** Déclenche un nouveau rendu du canevas, en appliquant visuellement le recadrage.
- **`CoverImage`/`CoverVideo` (`fabric-utils.ts`) :**  Ces classes Fabric.js personnalisées gèrent le dessin réel du média recadré sur le canevas.

Cette ventilation détaillée du mécanisme de recadrage personnalisé fournit une image plus claire de la façon dont les interactions de l'utilisateur, la logique des composants et le flux de données dans Fabric Video Editor se rejoignent pour réaliser cette fonctionnalité.

## 6. Intégration de FFMPEG.wasm

Bien que le code fourni ne présente pas explicitement l'utilisation directe de FFMPEG.wasm, son rôle est implicite dans la fonction `saveCanvasToVideoWithAudio`. Cette section décrit comment FFMPEG.wasm serait probablement intégré à ce projet pour le traitement et l'exportation vidéo, y compris la façon de personnaliser les paramètres de sortie tels que le format et la durée.

### 6.1 Traitement vidéo avec FFMPEG.wasm : une vue d'ensemble conceptuelle

FFMPEG.wasm apporte la puissance du framework multimédia populaire FFMPEG au navigateur à l'aide de WebAssembly. Voici comment il serait probablement utilisé dans cet éditeur vidéo :

1. **Initialisation :**
   - Vous devez charger et initialiser la bibliothèque FFMPEG.wasm dans votre projet. Il existe différentes manières de procéder, notamment en utilisant un CDN ou en l'intégrant à votre application.

2. **Capture du canevas :**
   - La fonction `saveCanvasToVideoWithAudio` montre déjà comment capturer le contenu du canevas en tant que flux à l'aide de `canvas.captureStream(60)`. Ce flux servira d'entrée vidéo pour FFMPEG.wasm.

   **Note:** le paramètre 60 de `canvas.captureStream(60)` correspond à la fréquence d'image de la capture vidéo.   

3. **Gestion audio :**
   - Le code montre également comment collecter les flux audio à partir des `AudioEditorElement`s et les fusionner dans le flux principal du canevas. Ce flux combiné contiendra à la fois la vidéo et l'audio.

4. **Traitement FFMPEG.wasm :**
   -  C'est là que FFMPEG.wasm entre en jeu. Vous créeriez une instance FFMPEG.wasm et lui fourniriez le flux vidéo et audio combiné.
   -  Vous utiliseriez ensuite l'API de FFMPEG.wasm pour :
      - **Définir le format de sortie :** Spécifiez le format de conteneur vidéo souhaité (par exemple, MP4, WebM).
      - **Contrôler la durée :**  Limitez la durée de la vidéo de sortie en fonction de la timeline de l'éditeur (en utilisant la valeur `maxTime` du magasin).
      - **Appliquer un traitement supplémentaire (facultatif) :** 
         - Vous pouvez potentiellement ajouter des transitions entre les éléments, appliquer des filtres vidéo plus complexes, ajuster les niveaux audio et effectuer d'autres opérations de montage vidéo à l'aide des commandes de FFMPEG.wasm.

5. **Encodage et sortie :**
   - Enfin, vous demanderiez à FFMPEG.wasm d'encoder le flux traité dans le format de sortie choisi. 
   - FFMPEG.wasm fournirait un moyen d'obtenir les données vidéo encodées, que vous pourriez ensuite utiliser pour :
      - Créer un blob téléchargeable pour l'utilisateur.
      - Afficher un aperçu de la vidéo finale dans l'éditeur.

### 6.2 Modification des paramètres de sortie : format et durée

- **Format :** Vous spécifiez généralement le format de sortie à l'aide de la syntaxe de ligne de commande de FFMPEG.wasm. Par exemple, pour sortir un fichier MP4, vous pouvez utiliser une commande similaire à : 
  ```
  ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4
  ``` 

- **Durée :** FFMPEG.wasm vous permet de contrôler la durée de la vidéo de sortie à l'aide de l'indicateur `-t`.  Vous utiliseriez probablement la propriété `maxTime` du magasin MobX pour limiter la durée de la sortie :
  ```
  ffmpeg -i input.webm -t [maxTime en secondes] output.mp4 
  ```

### 6.3 Exemple de code (illustratif) :

```javascript
// Exemple simplifié (suppose que FFMPEG.wasm est initialisé)
async function exportVideo() {
  // ... logique de capture de canevas et de fusion audio (comme dans saveCanvasToVideoWithAudio)

  const ffmpeg = new FFMpeg(); // Créer une instance FFMPEG.wasm

  ffmpeg.FS('writeFile', 'input.webm', await fetchFile(combinedStream)); // Charger le flux dans le système de fichiers virtuel de FFMPEG.wasm

  await ffmpeg.run(
    '-i', 'input.webm',
    '-c:v', 'libx264', // Codec vidéo
    '-c:a', 'aac',      // Codec audio
    '-t', store.maxTime / 1000, // Durée en secondes
    'output.mp4' 
  );

  const data = ffmpeg.FS('readFile', 'output.mp4'); // Obtenir les données encodées
  // ... créer un blob téléchargeable ou afficher un aperçu
} 
```

**Remarque :** Il s'agit d'une illustration simplifiée. L'implémentation réelle impliquerait des interactions plus complexes avec l'API de FFMPEG.wasm, la gestion des erreurs et utiliserait probablement un thread de travail pour les performances.

En intégrant FFMPEG.wasm, Fabric Video Editor acquiert la capacité de traiter et d'exporter des vidéos avec des paramètres de format et de durée personnalisés, en tirant parti des capacités étendues de FFMPEG dans un environnement basé sur un navigateur.

## 8. Dépannage

Cette section vise à résoudre les problèmes potentiels que vous pourriez rencontrer lors de l'utilisation ou du développement de Fabric Video Editor, en fournissant des solutions ou des solutions de contournement.

### Problèmes courants :

1. **Problèmes de synchronisation audio :**
   - **Problème :** L'audio peut ne pas être synchronisé avec la vidéo dans la sortie exportée.
   - **Causes possibles :**
      -  Calculs de synchronisation inexacts pendant la lecture ou l'exportation.
      -  Problèmes de fusion de flux audio provenant de différentes sources.
   - **Étapes de dépannage :**
      - Examinez attentivement la logique de `updateTimeTo`, `updateVideoElements` et `updateAudioElements` dans `Store.ts` pour vous assurer de la synchronisation correcte de la lecture multimédia.
      - Vérifiez le processus de fusion audio dans `saveCanvasToVideoWithAudio`.
      - Envisagez d'utiliser une bibliothèque de journalisation pour afficher les horodatages pendant la lecture et l'exportation pour faciliter le débogage.

2. **Problèmes de durée de la vidéo exportée :**
   - **Problème :** La vidéo exportée peut avoir une durée incorrecte, trop courte ou trop longue.
   - **Causes possibles :**
      - Valeur `maxTime` incorrecte dans le magasin.
      -  Les paramètres de durée de FFMPEG.wasm ne sont pas appliqués correctement.
   - **Étapes de dépannage :**
      - Vérifiez que la propriété `maxTime` dans `Store.ts` reflète avec précision la durée souhaitée de la vidéo.
      -  Si vous utilisez FFMPEG.wasm, assurez-vous que l'indicateur `-t` est utilisé avec la valeur de durée correcte en secondes.

3. **Scintillement dans la vidéo exportée :**
   - **Problème :** La vidéo exportée peut présenter un scintillement ou des artefacts visuels.
   - **Causes possibles :**
      - Problèmes avec la fréquence d'images de capture du canevas.
      - Incompatibilités avec certains codecs vidéo ou paramètres d'encodage.
   - **Étapes de dépannage :**
      - Essayez différentes fréquences d'images pour la capture du canevas (par exemple, essayez 30 ou 25 ips au lieu de 60).
      - Essayez d'utiliser différents codecs vidéo et paramètres d'encodage lors de l'exportation FFMPEG.wasm.
      -  Assurez-vous que votre navigateur et votre matériel prennent en charge le codec et les paramètres d'encodage choisis.

4. **Problèmes de performances :**
   - **Problème :**  L'éditeur peut être lent ou saccadé, en particulier avec des projets volumineux ou des vidéos longues.
   - **Causes possibles :**
      - Rendu inefficace des éléments sur le canevas.
      - Animations ou effets complexes.
   - **Étapes de dépannage :**
      - Optimisez le rendu du canevas dans `refreshElements` en minimisant les redessins inutiles.
      - Envisagez d'utiliser la mise en cache d'objets dans Fabric.js pour les éléments fréquemment mis à jour.
      - Simplifiez les animations ou les effets complexes.

### Conseils généraux de débogage :

- **Outils de développement du navigateur :**  Utilisez les outils de développement de votre navigateur (en particulier les onglets Console et Réseau) pour inspecter les erreurs, les journaux et l'activité du réseau.
- **Journalisation :**  Utilisez les instructions `console.log` de manière stratégique dans votre code pour suivre les valeurs, l'exécution des fonctions et les informations de synchronisation.
- **Points d'arrêt :** Si vous utilisez un débogueur comme celui de VS Code, définissez des points d'arrêt dans votre code pour interrompre l'exécution et inspecter les variables à des points spécifiques.
- **Isoler les problèmes :** Essayez de désactiver certaines fonctionnalités ou certains éléments pour identifier la source d'un problème.


## 9. Glossaire

- **Rapport hauteur/largeur :** La relation proportionnelle entre la largeur et la hauteur d'une image ou d'une vidéo (par exemple, 16:9, 4:3).
- **Codec :** Une méthode de compression et de décompression de médias numériques (par exemple, vidéo ou audio). Exemples : H.264, VP9 (codecs vidéo), AAC, MP3 (codecs audio).
- **Élément :**  Un composant multimédia individuel (vidéo, image, audio ou texte) qui peut être ajouté à la timeline de l'éditeur vidéo.
- **FFMPEG :**  Un framework multimédia open source populaire utilisé pour la gestion de la vidéo et de l'audio, y compris l'encodage, le décodage, le transcodage, etc.
- **FFMPEG.wasm :** Un port WebAssembly de FFMPEG, permettant son utilisation dans les navigateurs Web.
- **Fabric.js :**  Une bibliothèque JavaScript qui simplifie le travail avec l'élément de canevas HTML5, fournissant des outils pour dessiner, manipuler et animer des objets.
- **Image clé (Keyframe) :**  En animation, un point spécifique dans le temps où les propriétés d'un élément (par exemple, la position, l'opacité) sont définies. Le logiciel d'animation interpole entre les images clés pour créer des transitions fluides. 
- **MobX :** Une bibliothèque de gestion d'état pour les applications JavaScript, fournissant un moyen réactif et observable de gérer les données.
- **React :** Une bibliothèque JavaScript pour la création d'interfaces utilisateur. 
- **Timeline :** Une représentation visuelle de la structure d'un projet vidéo au fil du temps, montrant la séquence et la durée des éléments.
- **TimeFrame :**  Les heures de début et de fin d'un élément sur la timeline, définissant sa durée.
- **WebAssembly (Wasm) :** Un format d'instructions binaires pour une machine virtuelle basée sur une pile, permettant au code écrit dans d'autres langages (comme C++) de s'exécuter dans les navigateurs Web.



J'espère que cette documentation complète vous a fourni des informations précieuses sur Fabric Video Editor.
