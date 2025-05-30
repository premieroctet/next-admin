export default {
  admin: {
    theme: {
      dark: "Sombre",
      light: "Clair",
      system: "Système",
    },
    model: {
      User: {
        name: "Utilisateur",
        plural: "Utilisateurs",
        fields: {
          id: "ID",
          email: "Email",
          name: "Nom",
          birthDate: "Date de naissance",
          role: "Rôle",
          metadata: "Métadonnées",
        },
      },
      Post: {
        name: "Article",
        plural: "Articles",
        fields: {
          id: "ID",
          title: "Titre",
          content: "Contenu",
          author: "Auteur",
          rate: "Note",
          published: "Publié",
          categories: "Catégories",
        },
      },
      Category: {
        name: "Catégorie",
        plural: "Catégories",
        fields: {
          id: "ID",
          name: "Nom",
          posts: "Articles",
        },
      },
    },
    list: {
      header: {
        add: {
          label: "Ajouter",
        },
        search: {
          result: "{{count}} éléments",
          placeholder: "Recherche",
        },
      },
      footer: {
        indicator: {
          showing: "Affichage de",
          to: "à",
          of: "sur",
        },
      },
      row: {
        actions: {
          delete: {
            label: "Supprimer",
          },
          export: "Exporter en {{format}}",
        },
      },
      empty: {
        label: "Aucun(e) {{resource}} trouvé(e)",
        caption: "Commencez par créer un nouvel objet {{resource}}",
      },
    },
    selector: {
      loading: "Chargement",
    },
    form: {
      create: {
        succeed: "Création réussie",
      },
      update: {
        succeed: "Mise à jour réussie",
      },
      delete: {
        succeed: "Suppression réussie",
      },
      validation: {
        error: "Erreur de validation",
      },
      button: {
        delete: {
          label: "Supprimer",
        },
        save: {
          label: "Enregistrer",
        },
        save_edit: {
          label: "Enregistrer et poursuivre l'édition",
        },
      },
      widgets: {
        file_upload: {
          label: "Choisir un fichier",
          delete: "Supprimer",
        },
        multiselect: {
          select: "Sélectionner",
        },
      },
      user: {
        email: {
          error: "Email invalide",
        },
      },
    },
    export: {
      label: "Exporter",
    },
    actions: {
      some_failed_condition:
        "Certains éléments ne peuvent pas effectuer cette action",
      post: {
        publish: {
          title: "Publier",
          success: "Article publié avec succès",
        },
        "add-tag": {
          title: "Ajouter un tag",
          success: "Tag ajouté avec succès",
        },
      },
      user: {
        email: {
          title: "Envoyer un email",
          success: "Email envoyé avec succès",
          error: "Erreur lors de l'envoi de l'email",
        },
        details: {
          title: "Détails de l'utilisateur",
        },
      },
      label: "Action",
      delete: {
        label: "Supprimer",
      },
      create: {
        label: "Créer",
      },
      edit: {
        label: "Éditer",
      },
    },
    user: {
      logout: "Déconnexion",
    },
  },
};
