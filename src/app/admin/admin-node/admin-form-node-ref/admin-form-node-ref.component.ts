import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-form-node-ref',
  templateUrl: './admin-form-node-ref.component.html',
  styleUrls: ['./admin-form-node-ref.component.scss']
})
export class AdminFormNodeRefComponent implements OnInit {
  @Input() src;
  @Input() type;
  @Input() history;

  constructor() { }

  ngOnInit() {}

  addTo($event: any) {
    if ($event) {
      let found = false;
      this.src.forEach(function (item) {
        if (item.target_id === $event.dragData.target_id) {
          found = true;
        }
      });
      if (!found) {
        this.src.push($event.dragData);
      }
    }
  }

}
