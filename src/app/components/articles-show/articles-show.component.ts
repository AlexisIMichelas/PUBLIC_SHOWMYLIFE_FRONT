import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

// Importer Cloudinary
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

@Component({
  selector: 'app-articles-show',
  templateUrl: './articles-show.component.html',
  styleUrls: ['./articles-show.component.css']
})
export class ArticlesShowComponent implements OnInit {
  articles: Article[] = [];
  selectedArticle?: Article;
  message: string = '';
  searchTerm: string = '';

  public cld: Cloudinary;

  constructor(private articleService: ArticleService) {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'ddaxulsi7'
      }
    });
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  openModal(article: Article): void {
    this.selectedArticle = article;
    const modal = document.getElementById('articleModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.map(article => {
          if (article.image) {
            console.log('Public ID:', article.image); // Pour le débogage

            // Vérifiez si l'image est une URL complète
            const img = article.image.includes('cloudinary.com')
              ? article.image // Si c'est déjà une URL Cloudinary, ne pas appliquer de transformation
              : this.cld.image(article.image).resize(fill().width(300).height(200)).toURL();

            article.image = img;
          }
          return article;
        });
      },
      error: (err) => {
        console.error(err);
        this.message = 'Erreur lors de la récupération des articles.';
      }
    });
  }

  searchArticles(): void {
    if (this.searchTerm.trim() === '') {
      this.loadArticles();
      return;
    }

    this.articleService.findByTitle(this.searchTerm).subscribe({
      next: (data) => {
        this.articles = data.map(article => {
          if (article.image) {
            const img = article.image.includes('cloudinary.com')
              ? article.image // Si c'est déjà une URL Cloudinary, ne pas appliquer de transformation
              : this.cld.image(article.image).resize(fill().width(300).height(200)).toURL();

            article.image = img;
          }
          return article;
        });
      },
      error: (err) => {
        console.error(err);
        this.message = 'Erreur lors de la recherche des articles.';
      }
    });
  }
}
