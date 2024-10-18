import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = []; // Initialisé à un tableau vide
  currentArticle: Article = { id: -1 }; // Initialisation pour éviter undefined
  currentIndex = -1;
  title = '';

  private cld: Cloudinary;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'ddaxulsi7', // Remplacez par votre nom de cloud
      },
    });
  }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  retrieveArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.map(article => {
          if (article.image) {
            // Vérifiez si l'image est déjà une URL Cloudinary
            const isCloudinaryUrl = article.image.includes('cloudinary.com');
            if (isCloudinaryUrl) {
              article['cloudinaryImage'] = article.image; // Utiliser directement l'URL
            } else {
              // Créer l'objet CloudinaryImage avec le public_id
              const img = this.cld.image(article.image);
              img.resize(fill().width(150).height(150)); // Redimensionner l'image
              article['cloudinaryImage'] = img.toURL(); // Convertir l'image en URL
            }
          }
          return article;
        });
        console.log(this.articles); // Vérification dans la console
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.retrieveArticles();
    this.currentArticle = {};
    this.currentIndex = -1;
  }

  setActiveArticle(article: Article, index: number): void {
    this.currentArticle = article;
    this.currentIndex = index;
  }

  removeArticle(id: number): void {
    this.articleService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  removeAllArticles(): void {
    this.articleService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchTitle(): void {
    this.currentArticle = {};
    this.currentIndex = -1;

    this.articleService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.articles = data.map(article => {
          if (article.image) {
            const isCloudinaryUrl = article.image.includes('cloudinary.com');
            if (isCloudinaryUrl) {
              article['cloudinaryImage'] = article.image; // Utiliser directement l'URL
            } else {
              const img = this.cld.image(article.image);
              img.resize(fill().width(150).height(150));
              article['cloudinaryImage'] = img.toURL(); // Convertir l'image en URL
            }
          }
          return article;
        });
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  editArticle(article: Article): void {
    this.router.navigate(['/articles', article.id], { queryParams: { edit: true } });
  }
}
