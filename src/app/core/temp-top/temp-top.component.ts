import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-temp-top',
  templateUrl: './temp-top.component.html',
  styleUrls: ['./temp-top.component.scss']
})
export class TempTopComponent implements OnInit {
  public variables: any;

  constructor(
    private variableService: VariableService,
  ) {
    this.variables = variableService;
  }

  ngOnInit() {
  }

}
