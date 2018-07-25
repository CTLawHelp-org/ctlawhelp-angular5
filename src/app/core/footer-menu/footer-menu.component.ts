import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterMenuComponent implements OnInit {
  public menu: any;
  public variables: any;

  constructor(
    private variableService: VariableService
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    this.menu = [
      {
        name: 'Copyright',
        es: 'Propiedad Intelectual',
        link: 'copyright'
      },
      {
        name: 'Accessibility',
        es: 'Accesibilidad',
        link: 'accessibility'
      },
      {
        name: 'Privacy',
        es: 'Privacidad',
        link: 'privacy'
      },
      {
        name: 'Legal Disclaimer',
        es: 'Renuncia Responsabilidad',
        link: 'legal'
      },
      {
        name: 'Contact',
        es: 'Contacto',
        link: 'contact'
      },
      {
        name: 'About Us',
        es: 'Quienes Somos',
        link: 'about-us'
      }
    ];
  }

}
