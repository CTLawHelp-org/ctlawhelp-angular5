import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-loader',
  templateUrl: './admin-loader.component.html',
  styleUrls: ['./admin-loader.component.scss']
})
export class AdminLoaderComponent implements OnInit {
  @Input() small = false;

  constructor() { }

  ngOnInit() {
  }

}
