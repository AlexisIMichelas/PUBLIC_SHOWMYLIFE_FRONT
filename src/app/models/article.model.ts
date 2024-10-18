export interface Article {
  id?: any;
  title?: string;
  description?: string;
  published?: boolean;
  image?: string; // Si vous avez cette propriété pour stocker l'ID de l'image
  cloudinaryImage?: any; // Ajouter cette ligne pour permettre l'utilisation de cloudinaryImage
}
