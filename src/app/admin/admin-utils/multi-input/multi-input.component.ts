import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-input',
  templateUrl: './multi-input.component.html',
  styleUrls: ['./multi-input.component.scss']
})
export class MultiInputComponent implements OnInit {
  @Input() value;
  @Input() type;
  @Input() history;

  constructor() { }

  ngOnInit() {
  }

  remove(index: number) {
    this.value.splice(index, 1);
    this.history[this.type] = this.value;
  }

  addNew() {
    this.value.push({value: ''});
    this.history[this.type] = this.value;
  }

  updateHistory(event: any) {
    this.history[this.type] = this.value;
  }

}
