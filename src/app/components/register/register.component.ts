import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null, // Assurez-vous d'avoir un champ email
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    const { username, email, password } = this.form;

    // Vérifiez que l'adresse e-mail est une adresse Gmail valide
    if (!this.isValidGmail(email)) {
      this.errorMessage = 'Veuillez utiliser une adresse Gmail valide (ex: user@gmail.com ou user@gmail.fr).';
      this.isSignUpFailed = true;
      return; 
    }

    this.authService.register(username, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']); // Redirigez vers la page de connexion après l'inscription réussie
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  // Méthode pour vérifier si l'adresse e-mail est un Gmail valide
  private isValidGmail(email: string): boolean {
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.(com|fr)$/; // Permet les adresses @gmail.com et @gmail.fr
    return gmailPattern.test(email); // Renvoie true si l'e-mail correspond au motif
  }
}
