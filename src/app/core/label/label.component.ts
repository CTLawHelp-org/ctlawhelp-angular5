import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminLabelEditorDialogComponent } from '../../admin/admin-utils/admin-label-editor/admin-label-editor.component';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent implements OnInit, OnDestroy {
  @Input() src;
  private langsub: any;
  private varsub: any;
  public variables: any;

  constructor(
    private variableService: VariableService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const compname = this.route.snapshot.component && this.route.snapshot.component['name']
      ? this.route.snapshot.component['name'] : 'root';
    if (compname !== 'root') {
      this.variables.labelComp = compname;
    }
    if (this.variables.labelMap[compname]
      && this.variables.labelMap[compname].length > 0
      && this.variables.labelMap[compname].indexOf(this.src) === -1) {
      this.variables.labelMap[compname].push(this.src);
    } else {
      this.variables.labelMap[compname] = [this.src];
    }

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.varsub = this.variableService.varSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.varsub) {
      this.varsub.unsubscribe();
    }
  }

  editLabels(item: any) {
    const width = '80vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminLabelEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { label: item }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
