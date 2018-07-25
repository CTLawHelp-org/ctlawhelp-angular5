import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicFormGroupModel,
  DynamicTextAreaModel,
  DynamicSelectModel,
  DynamicEditorModel,
} from '@ng-dynamic-forms/core';

export const MENU_FORM: DynamicFormControlModel[] = [

  new DynamicFormGroupModel({
    id: 'english',
    legend: 'English',
    group: [
      new DynamicInputModel({
        id: 'title_en',
        label: 'English Title',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
    ],
  }),

  new DynamicFormGroupModel({
    id: 'spanish',
    legend: 'Spanish',
    group: [
      new DynamicInputModel({
        id: 'title_es',
        label: 'Spanish Title',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
    ],
  }),

  new DynamicInputModel({
    id: 'link',
    label: 'Link',
    validators: {
      required: null
    },
    errorMessages: {
      required: '{{label}} is required.'
    }
  }),

];

export const MENU_FORM_LAYOUT = {
  'english': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'title_en': {
    grid: {
      label: 'required'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'title_es': {
    grid: {
      label: 'required'
    }
  },
  'link': {
    grid: {
      label: 'required',
      container: 'pad ui-g-12',
    }
  },
};
