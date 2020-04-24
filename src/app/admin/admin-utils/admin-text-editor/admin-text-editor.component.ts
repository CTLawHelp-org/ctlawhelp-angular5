import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-text-editor',
  templateUrl: './admin-text-editor.component.html',
  styleUrls: ['./admin-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTextEditorComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() type = 'body';
  @Input() elname: string;
  @Input() src: any;
  public loaded = false;
  public variables: any;

  constructor(
    private variableService: VariableService,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document,
  ) {
    this.variables = variableService;
    if (isPlatformBrowser(this.platformId) && !document.getElementById('ckeditor-script')) {
      const ck = this.renderer2.createElement('script');
      ck.id = 'ckeditor-script';
      ck.src = 'https://cdn.ckeditor.com/4.11.4/full/ckeditor.js';
      this.renderer2.appendChild(this.document.body, ck);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.type === 'summary') {
      this.setupSummaryCK();
    } else {
      this.setupBodyCK();
    }
  }

  setupBodyCK() {
    if (typeof CKEDITOR === 'undefined') {
      setTimeout( () => {
        this.setupBodyCK();
      });
    } else {
      const toolbar = [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'paragraph', items: ['BulletedList', 'NumberedList', 'Blockquote']},
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'insert', items: ['Image', 'Table', 'SpecialChar', 'Iframe']},
        {name: 'forms', items: ['Outdent', 'Indent']},
        {name: 'clipboard', items: ['Undo', 'Redo']},
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      setTimeout( () => {
        // extra options
        if (!this.document.getElementById('ck-extras')) {
          const ck_opt = this.renderer2.createElement('script');
          ck_opt.text = 'CKEDITOR.dtd.$removeEmpty[\'span\'] = false;';
          ck_opt.id = 'ck-extras';
          this.renderer2.appendChild(this.document.body, ck_opt);
        }
        CKEDITOR.replace(this.elname, {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
        this.loaded = true;
      });
    }
  }

  setupSummaryCK() {
    if (typeof CKEDITOR === 'undefined') {
      setTimeout( () => {
        this.setupSummaryCK();
      });
    } else {
      const toolbar_min = [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      setTimeout( () => {
        // extra options
        if (!this.document.getElementById('ck-extras')) {
          const ck_opt = this.renderer2.createElement('script');
          ck_opt.text = 'CKEDITOR.dtd.$removeEmpty[\'span\'] = false;';
          ck_opt.id = 'ck-extras';
          this.renderer2.appendChild(this.document.body, ck_opt);
        }
        CKEDITOR.replace(this.elname, {
          language: 'en',
          toolbar: toolbar_min,
          allowedContent: true,
          height: 100,
        });
        this.loaded = true;
      });
    }
  }

}
