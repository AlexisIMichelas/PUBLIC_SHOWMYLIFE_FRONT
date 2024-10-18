import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css'],
})
export class ArticleDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentArticle: Article = {
    id: null,
    title: '',
    description: '',
    published: false,
    image: '',
  };

  message = '';
  editMode: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getArticle(this.route.snapshot.params['id']);
      this.route.queryParams.subscribe(params => {
        this.editMode = params['edit'] === 'true';
      });
    }
  }

  getArticle(id: string): void {
    this.articleService.get(id).subscribe({
      next: (data) => {
        this.currentArticle = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  deleteArticle(): void {
    this.articleService.delete(this.currentArticle.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/articles']);
      },
      error: (e) => console.error(e),
    });
  }

  updateArticle(): void {
    // Vérification des champs obligatoires
    if (!this.currentArticle.title || !this.currentArticle.description) {
      alert("Le titre et la description sont obligatoires !");
      return;
    }

    const updateData = {
      title: this.currentArticle.title,
      description: this.currentArticle.description,
      published: this.currentArticle.published,
      image: this.currentArticle.image // On garde la même image par défaut
    };

    // Si un fichier a été sélectionné, le lire comme base64
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        updateData.image = event.target.result; // La chaîne base64

        // Mettre à jour l'article
        this.articleService.update(this.currentArticle.id, updateData).subscribe({
          next: (res) => {
            console.log(res);
            this.message = "L'article a été mis à jour avec succès.";
            this.router.navigate(['/articles']);
          },
          error: (e) => {
            console.error(e);
            this.message = "Erreur lors de la mise à jour de l'article.";
          }
        });
      };
      reader.readAsDataURL(this.selectedFile); // Lire le fichier comme base64
    } else {
      // Si aucun fichier n'est sélectionné, mettez simplement à jour les autres champs
      this.articleService.update(this.currentArticle.id, updateData).subscribe({
        next: (res) => {
          console.log(res);
          this.message = "L'article a été mis à jour avec succès.";
          this.router.navigate(['/articles']);
        },
        error: (e) => {
          console.error(e);
          this.message = "Erreur lors de la mise à jour de l'article.";
        }
      });
    }
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0]; // Enregistre le fichier sélectionné
    }
  }
}
