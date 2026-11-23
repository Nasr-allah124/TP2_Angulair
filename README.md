# TP 2 — Gestion des tâches avec le stack MEAN

L’application permet d’ajouter une tâche, de consulter la liste, de modifier son titre ou sa description, de terminer ou reprendre une tâche et de la supprimer. MongoDB conserve la liste après rechargement de la page.

## Démarrage sous Windows

Prérequis utilisés pour ce projet : Node.js 26, npm et MongoDB. Démarrer le service MongoDB s’il est arrêté. Le projet utilise par défaut la base locale `tp2_todo` sur le port `27017`.

Dans un premier terminal PowerShell, depuis la racine du projet :

```powershell
cd backend
npm.cmd ci
npm.cmd start
```

Dans un deuxième terminal PowerShell, depuis la racine du projet :

```powershell
cd frontend
npm.cmd ci
npm.cmd start
```

Ouvrir [http://localhost:4200](http://localhost:4200). L’API écoute sur `http://127.0.0.1:3000`. Le proxy du serveur Angular redirige les requêtes `/tasks` vers cette API. Pour utiliser une autre instance MongoDB, définir la variable d’environnement `MONGODB_URI` avant de lancer le backend.

## API REST

| Méthode | Route | Corps JSON | Succès |
| --- | --- | --- | --- |
| GET | `/tasks` | — | `200` et la liste des tâches |
| POST | `/tasks` | `{"title":"Réviser Angular"}` | `201` et la tâche créée |
| PUT | `/tasks/:id` | `{"title":"Réviser le TP"}` ou `{"completed":true}` | `200` et la tâche mise à jour |
| DELETE | `/tasks/:id` | — | `204` |

Chaque tâche contient un identifiant MongoDB `_id`, un titre `title` et un booléen `completed`, qui vaut `false` par défaut. La description facultative `description` reprend le champ illustré dans l’énoncé. L’API renvoie `400` pour une saisie invalide et `404` si l’identifiant valide ne correspond à aucune tâche.

## Organisation du code

- `backend/server.js` démarre Express après la connexion à MongoDB.
- `backend/models/task.js` définit le modèle Mongoose. `backend/routes/tasks.js` valide les requêtes et effectue les opérations CRUD.
- `frontend/src/app/task.service.ts` centralise les requêtes REST avec Angular HttpClient.
- `frontend/src/app/app.component.*` gère l’affichage et les formulaires avec Angular Forms.

Pour vérifier le parcours, ajouter une tâche, modifier son titre et sa description, la terminer puis la reprendre. Recharger la page pour vérifier la persistance, puis supprimer la tâche. Pour compiler le frontend, exécuter `npm.cmd run build` dans `frontend`.
