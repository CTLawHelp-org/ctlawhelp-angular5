import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { VariableService } from '../../../services/variable.service';
import { AdminFormSegmentRefDialogComponent } from '../admin-form-segment-ref/admin-form-segment-ref.component';
import {
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';
import { PAGE_SETTINGS_FORM, PAGE_SETTINGS_FORM_LAYOUT } from '../../admin-models/page-settings-form.model';
import { FormArray, FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-form-node-settings',
  templateUrl: './admin-form-node-settings.component.html',
})
export class AdminFormNodeSettingsComponent implements OnInit {
  @Input() src;
  @Input() history;

  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit() {}

  editSettings() {
    const width = '95vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminFormNodeSettingsDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        node: this.src,
        changes: this.history
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'app-admin-form-node-settings-dialog',
  templateUrl: './admin-form-node-settings.dialog.html',
  styleUrls: ['./admin-form-node-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFormNodeSettingsDialogComponent implements OnInit {
  public variables: any;
  public node = [];
  public changes = {};
  public formModel: DynamicFormControlModel[] = PAGE_SETTINGS_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = PAGE_SETTINGS_FORM_LAYOUT;

  constructor(
    private variableService: VariableService,
    public dialogRef: MatDialogRef<AdminFormSegmentRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: DynamicFormService,
  ) {
    this.variables = this.variableService;
    this.node = data.node;
    this.changes = data.changes;
  }

  ngOnInit() {
    this.resetModel();
  }

  resetModel() {
    this.formModel.forEach(function (model) {
      if (model['group'] && model['group'].length > 0) {
        model['group'].forEach(function (item) {
          item['value'] = null;
        });
      } else {
        model['value'] = null;
      }
    });
    this.doneLoading();
  }

  doneLoading() {
    if (this.node.length > 0) {
      if (this.node[0].new) {
        this.setupNew();
      } else {
        this.setupForm();
      }
    }
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  setupNew() {
    // meta_title_en
    if (typeof this.changes['meta_title_en'] !== 'undefined') {
      const meta_title_en = this.formService.findById('meta_title_en', this.formModel) as DynamicInputModel;
      meta_title_en.valueUpdates.next(this.changes['meta_title_en']);
    }
    // meta_desc_en
    if (typeof this.changes['meta_desc_en'] !== 'undefined') {
      const meta_desc_en = this.formService.findById('meta_desc_en', this.formModel) as DynamicInputModel;
      meta_desc_en.valueUpdates.next(this.changes['meta_desc_en']);
    }
    // path_en
    if (typeof this.changes['path_en'] !== 'undefined') {
      const path_en = this.formService.findById('path_en', this.formModel) as DynamicInputModel;
      path_en.valueUpdates.next(this.changes['path_en']);
    }
    // meta_en
    if (typeof this.changes['meta_en'] !== 'undefined') {
      const meta_en = this.formService.findById('meta_en', this.formModel) as DynamicInputModel;
      meta_en.valueUpdates.next(this.changes['meta_en']);
    }
    // old_path_en
    const old_path_en = this.formService.findById('old_path_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['old_path_en'] !== 'undefined') {
      old_path_en.valueUpdates.next(this.changes['old_path_en']);
    } else {
      old_path_en.valueUpdates.next([]);
    }
    // spanish
    // meta_title_es
    if (typeof this.changes['meta_title_es'] !== 'undefined') {
      const meta_title_es = this.formService.findById('meta_title_es', this.formModel) as DynamicInputModel;
      meta_title_es.valueUpdates.next(this.changes['meta_title_es']);
    }
    // meta_desc_es
    if (typeof this.changes['meta_desc_es'] !== 'undefined') {
      const meta_desc_es = this.formService.findById('meta_desc_es', this.formModel) as DynamicInputModel;
      meta_desc_es.valueUpdates.next(this.changes['meta_desc_es']);
    }
    // path_es
    if (typeof this.changes['path_es'] !== 'undefined') {
      const path_es = this.formService.findById('path_es', this.formModel) as DynamicInputModel;
      path_es.valueUpdates.next(this.changes['path_es']);
    }
    // meta_es
    if (typeof this.changes['meta_es'] !== 'undefined') {
      const meta_es = this.formService.findById('meta_es', this.formModel) as DynamicInputModel;
      meta_es.valueUpdates.next(this.changes['meta_es']);
    }
    // old_path_es
    const old_path_es = this.formService.findById('old_path_es', this.formModel) as DynamicInputModel;
    if (typeof this.changes['old_path_es'] !== 'undefined') {
      old_path_es.valueUpdates.next(this.changes['old_path_es']);
    } else {
      old_path_es.valueUpdates.next([]);
    }
  }

  setupForm() {
    // meta_title_en
    const meta_title_en = this.formService.findById('meta_title_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['meta_title_en'] !== 'undefined') {
      meta_title_en.valueUpdates.next(this.changes['meta_title_en']);
    } else if (this.node[0].node_export.field_meta_title.length > 0) {
      meta_title_en.valueUpdates.next(this.node[0].node_export.field_meta_title[0].value);
    }
    // meta_desc_en
    const meta_desc_en = this.formService.findById('meta_desc_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['meta_desc_en'] !== 'undefined') {
      meta_desc_en.valueUpdates.next(this.changes['meta_desc_en']);
    } else if (this.node[0].node_export.field_meta_desc.length > 0) {
      meta_desc_en.valueUpdates.next(this.node[0].node_export.field_meta_desc[0].value);
    }
    // path_en
    const path_en = this.formService.findById('path_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['path_en'] !== 'undefined') {
      path_en.valueUpdates.next(this.changes['path_en']);
    } else if (this.node[0].node_export.field_path.length > 0) {
      path_en.valueUpdates.next(this.node[0].node_export.field_path[0].value);
    }
    // meta_en
    const meta_en = this.formService.findById('meta_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['meta_en'] !== 'undefined') {
      meta_en.valueUpdates.next(this.changes['meta_en']);
    } else if (this.node[0].node_export.field_meta_text.length > 0) {
      meta_en.valueUpdates.next(this.node[0].node_export.field_meta_text[0].value);
    }
    // old_path_en
    const old_path_en = this.formService.findById('old_path_en', this.formModel) as DynamicInputModel;
    if (typeof this.changes['old_path_en'] !== 'undefined') {
      old_path_en.valueUpdates.next(this.changes['old_path_en']);
    } else if (this.node[0].node_export.field_old_path.length > 0) {
      old_path_en.valueUpdates.next(this.node[0].node_export.field_old_path);
    } else {
      old_path_en.valueUpdates.next([]);
    }
    // spanish
    const old_path_es = this.formService.findById('old_path_es', this.formModel) as DynamicInputModel;
    if (typeof this.node[0].node_export.i18n.es !== 'undefined') {
      // meta_title_es
      const meta_title_es = this.formService.findById('meta_title_es', this.formModel) as DynamicInputModel;
      if (typeof this.changes['meta_title_es'] !== 'undefined') {
        meta_title_es.valueUpdates.next(this.changes['meta_title_es']);
      } else if (this.node[0].node_export.i18n.es.field_meta_title.length > 0) {
        meta_title_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_meta_title[0].value);
      }
      // meta_desc_es
      const meta_desc_es = this.formService.findById('meta_desc_es', this.formModel) as DynamicInputModel;
      if (typeof this.changes['meta_desc_es'] !== 'undefined') {
        meta_desc_es.valueUpdates.next(this.changes['meta_desc_es']);
      } else if (this.node[0].node_export.i18n.es.field_meta_desc.length > 0) {
        meta_desc_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_meta_desc[0].value);
      }
      // path_es
      const path_es = this.formService.findById('path_es', this.formModel) as DynamicInputModel;
      if (typeof this.changes['path_es'] !== 'undefined') {
        path_es.valueUpdates.next(this.changes['path_es']);
      } else if (this.node[0].node_export.i18n.es.field_path.length > 0) {
        path_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_path[0].value);
      }
      // meta_es
      const meta_es = this.formService.findById('meta_es', this.formModel) as DynamicInputModel;
      if (typeof this.changes['meta_es'] !== 'undefined') {
        meta_es.valueUpdates.next(this.changes['meta_es']);
      } else if (this.node[0].node_export.i18n.es.field_meta_text.length > 0) {
        meta_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_meta_text[0].value);
      }
      // old_path_es
      if (typeof this.changes['old_path_es'] !== 'undefined') {
        old_path_es.valueUpdates.next(this.changes['old_path_es']);
      } else if (this.node[0].node_export.i18n.es.field_old_path.length > 0) {
        old_path_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_old_path);
      } else {
        old_path_es.valueUpdates.next([]);
      }
    }
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close(this.node);
  }
}
