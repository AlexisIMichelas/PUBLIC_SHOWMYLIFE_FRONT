import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../models/article.model';

// Importer Cloudinary et les actions nécessaires
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

@Component({
  selector: 'app-article-modal',
  templateUrl: './article-modal.component.html',
  styleUrls: ['./article-modal.component.css']
})
export class ArticleModalComponent implements OnInit {
  @Input() article?: Article; // Reçoit l'article depuis le parent
  public cld: Cloudinary;

  constructor() {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'ddaxulsi7' // Remplacez par votre Cloudinary cloudName
      }
    });
  }

  ngOnInit(): void {
    // Appliquez la même logique que dans le composant show pour transformer l'image
    if (this.article && this.article.image) {
      const img = this.article.image.includes('cloudinary.com')
        ? this.article.image // Si l'image est déjà une URL complète, ne rien faire
        : this.cld.image(this.article.image).resize(fill().width(300).height(300)).toURL(); // Transformation

      this.article.image = img; // Met à jour l'URL de l'image dans l'article
    }
  }

  closeModal(): void {
    const modal = document.getElementById('articleModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
