import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { NavbarComponent } from './home/navbar/navbar.component';


import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent,CommonModule, MatInputModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  }
  title = 'Inventario';
  currentYear: number = new Date().getFullYear();
  isLoginRoute(): boolean {
    const allowedRoutes = ['login', 'register'];
    const routePath = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    return routePath ? allowedRoutes.includes(routePath) : false;
  }
}
