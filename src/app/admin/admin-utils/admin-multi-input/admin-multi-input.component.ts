import { Component, Input, OnInit } from '@angular/core';
import { VariableService } from '../../../services/variable.service';

@Component({
  selector: 'app-admin-multi-input',
  templateUrl: './admin-multi-input.component.html',
  styleUrls: ['./admin-multi-input.component.scss']
})
export class AdminMultiInputComponent implements OnInit {
  @Input() value;
  @Input() label;
  public variables: any;

  constructor(
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

  addNew() {
    this.value.push({value: ''});
  }

}
