import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-triage-location',
  templateUrl: './triage-location.component.html',
  styleUrls: ['./triage-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageLocationComponent implements OnInit {
  public media: any;
  private connection: any;
  public variables: any;
  public locations = [];
  public zips = [];
  public user_city: any;
  public user_zip = '';
  public loc_set = false;
  public zip_error = false;
  public working = true;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    const loc_obs = this.apiService.getCTLocations();
    const zip_obs = this.apiService.getCTZips();
    const user_obs = this.variableService.getLocation();

    this.connection = forkJoin([loc_obs, zip_obs, user_obs]).subscribe(results => {
      this.locations = this.variables.sortByKey(results[0], 'city');
      this.zips = results[1];
      this.processLocation(results[2]);
      this.doneLoading();
    });

    this.variableService.locationSubject.subscribe(result => {
      this.user_zip = '';
      this.user_city = '';
      this.zip_error = false;
      this.loc_set = false;
      this.updateLoc();
    });
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  updateLoc() {
    this.variableService.getLocation().subscribe( result => {
      this.processLocation(result);
    });
  }

  processLocation(loc: any) {
    if (loc.zipcode && loc.zipcode !== '') {
      this.user_zip = loc.zipcode;
      this.loc_set = true;
    } else if (loc.city && loc.city !== '') {
      this.user_city = loc.city;
      this.loc_set = true;
    }
  }

  setLoc() {
    if (this.user_zip !== '') {
      this.working = true;
      const zip = this.validZip();
      if (zip) {
        this.working = true;
        const location = {
          county: zip.county.toLowerCase(),
          city: zip.city.toLowerCase(),
          zipcode: zip.zipcode
        };
        this.variableService.setLocation(location).subscribe(() => {
          this.user_zip = zip.zipcode;
          this.loc_set = true;
          this.working = false;
        });
      } else {
        this.zip_error = true;
      }
      this.working = false;
    } else if (this.user_city !== '') {
      this.working = true;
      const location = {
        county: this.user_city.county.toLowerCase(),
        city: this.user_city.city.toLowerCase()
      };
      this.variableService.setLocation(location).subscribe(() => {
        this.user_city = location.city;
        this.loc_set = true;
        this.working = false;
      });
    }
  }

  resetLoc() {
    this.working = true;
    this.variableService.setLocation({}).subscribe(() => {
      this.user_zip = '';
      this.user_city = '';
      this.zip_error = false;
      this.loc_set = false;
      this.working = false;
    });
  }

  validZip(): any {
    const self = this;
    let output = false;
    if (this.user_zip !== '') {
      this.zips.forEach(function(i) {
        if (self.user_zip === i.zipcode) {
          output = i;
        }
      });
    }
    return output;
  }

}
