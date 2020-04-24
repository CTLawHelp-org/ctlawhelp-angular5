import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';

@Component({
  selector: 'app-admin-node-ref',
  templateUrl: './admin-node-ref.component.html',
  styleUrls: ['./admin-node-ref.component.scss']
})
export class AdminNodeRefComponent implements OnInit {
  @Input() value;
  @Input() altvalue;
  @Input() nodeTypes;
  @Input() lang;
  @Input() label;
  public variables: any;
  public lastMoved: number;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

  updateIndex(event: any, value: any) {
    this.lastMoved = event.currentIndex;
    this.variables.dropFnc(event, value);
  }

}
