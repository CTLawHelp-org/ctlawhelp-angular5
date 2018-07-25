import { Component } from '@angular/core';
import { IFilterParams, IFloatingFilter, IFloatingFilterParams } from 'ag-grid';
import { AgFrameworkComponent } from 'ag-grid-angular';
import { SerializedTextFilter, TextFilter } from 'ag-grid/src/ts/filter/textFilter';

export interface SelectFilterChange {
  model: SerializedTextFilter;
}

export interface SelectFilterParams extends IFloatingFilterParams<SerializedTextFilter, SelectFilterChange> {
  value: string;
  opts: any;
}

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styles: [``]
})
export class SelectFilterComponent implements IFloatingFilter<SerializedTextFilter, SelectFilterChange, SelectFilterParams>,
  AgFrameworkComponent<SelectFilterParams> {
  params: SelectFilterParams;
  value: any = null;
  opts = [];
  public currentValue: string;

  agInit(params: SelectFilterParams): void {
    this.params = params;
    this.value = this.params.value;
    this.opts = this.params.opts;
  }

  valueChanged() {
    this.params.onFloatingFilterChanged({model: this.buildModel()});
  }

  onParentModelChanged(parentModel: SerializedTextFilter): void {
    if (!parentModel) {
      this.currentValue = '';
    } else {
      this.currentValue = parentModel.filter;
    }
  }

  buildModel(): SerializedTextFilter {
    if (this.currentValue === '') {
      return null;
    }
    return {
      filter: this.currentValue,
      type: 'equals',
      filterType: 'text'
    };
  }

}
