import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { StorageService } from '../../_services/storage.service';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'; // Import Cloudinary
import { fill } from '@cloudinary/url-gen/actions/resize'; // Import resize action

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
})
export class AddArticleComponent implements OnInit {
  article = {
    title: '',
    description: '',
    published: false,
    image: null as File | null, // Fichier image
  };
  submitted = false;
  previewImage: string | ArrayBuffer | null = null;
  img?: CloudinaryImage; // Optionnel: Image Cloudinary pour prévisualisation après upload

  private cld: Cloudinary; // Instance Cloudinary

  constructor(
    private articleService: ArticleService,
    private storageService: StorageService
  ) {
    // Initialiser Cloudinary avec le nom de ton cloud
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'ddaxulsi7', // Remplace par le nom de ton cloud Cloudinary
      },
    });
  }

  ngOnInit(): void {}

  // Fonction pour sauvegarder l'article et uploader l'image sur Cloudinary
  saveArticle(): void {
    if (this.article.image) {
      // Étape 1 : Uploader uniquement l'image
      this.articleService.upload(this.article.image).subscribe({
        next: (uploadResponse) => {
          // L'URL de l'image Cloudinary après l'upload
          const imageUrl = uploadResponse.secure_url;

          // Étape 2 : Créer un nouvel article avec l'URL de l'image
          const newArticle = {
            title: this.article.title,
            description: this.article.description,
            published: this.article.published,
            image: imageUrl, // URL Cloudinary après l'upload
          };

          console.log('New Article:', newArticle);

          // Envoie de l'article au backend
          this.articleService.create(newArticle).subscribe({
            next: (res) => {
              console.log(res);
              this.submitted = true;
              this.previewImage = null;

              // Prévisualisation de l'image avec Cloudinary
              this.img = this.cld.image(uploadResponse.public_id); // Utiliser l'ID de l'image Cloudinary
              this.img.resize(fill().width(250).height(250)); // Redimensionner pour l'affichage
            },
            error: (e) => console.error(e),
          });
        },
        error: (e) => console.error(e),
      });
    }
  }

  // Réinitialiser le formulaire pour ajouter un nouvel article
  newArticle(): void {
    this.submitted = false;
    this.article = {
      title: '',
      description: '',
      published: false,
      image: null,
    };
    this.previewImage = null;
    this.img = undefined; // Réinitialiser l'image Cloudinary
  }

  // Sélectionner un fichier et générer une prévisualisation de l'image
  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.article.image = file; // Stocker l'image sélectionnée dans l'article

      // Prévisualisation de l'image avant l'upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
