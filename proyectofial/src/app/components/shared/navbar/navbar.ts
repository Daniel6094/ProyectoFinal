import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  public esPantallaInicial = signal<boolean>(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        // Ocultar menú principal en la pantalla de inicio
        this.esPantallaInicial.set(url === '/inicio' || url === '/');
      });
  }
}
