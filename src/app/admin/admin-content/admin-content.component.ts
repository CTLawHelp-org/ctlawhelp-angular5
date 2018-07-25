import { Component, Inject, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminContentComponent implements OnInit {
  public working = true;
  public variables: any;
  public id: any;
  public node = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('ck-script')) {
        const ck = this.renderer2.createElement('script');
        ck.src = 'https://cdn.ckeditor.com/4.10.0/full/ckeditor.js';
        ck.id = 'ck-script';
        this.renderer2.appendChild(this.document.body, ck);
      }
    }
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.load();
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== '') {
      if (this.isNumeric(this.id)) {
        this.apiService.getNodeAdmin(this.id).subscribe( data => {
          this.node = data;
          this.working = false;
        });
      } else {
        this.node = [{
          new: true,
          node_export: {
            type: [{target_id: this.id}]
          }
        }];
        this.working = false;
      }
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

}
