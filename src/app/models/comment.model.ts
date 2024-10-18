// models/comment.model.ts
export interface Comment {
  id: number;
  userId: number; // L'ID de l'utilisateur
  articleId: number; // L'ID de l'article
  content: string; // Le contenu du commentaire
  userName?: string; // Le nom de l'utilisateur (facultatif, mais recommandé)
  createdAt?: Date; // Date de création (facultatif, mais recommandé)
}
