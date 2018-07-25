import { Component, Input, OnInit } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() src;
  public variables: any;

  constructor(
    private variableService: VariableService,
    private route: ActivatedRoute,
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
  }

}
