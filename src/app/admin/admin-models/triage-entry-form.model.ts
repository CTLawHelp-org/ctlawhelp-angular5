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

export const TRIAGE_ENTRY_FORM: DynamicFormControlModel[] = [

  new DynamicFormGroupModel({
    id: 'top',
    legend: 'Top',
    group: [
      new DynamicSelectModel({
        id: 'lang',
        label: 'Language',
        options: [
          {
            label: 'English',
            value: 'en'
          },
          {
            label: 'Spanish',
            value: 'es'
          },
          {
            label: 'Both',
            value: 'both'
          }
        ]
      }),

      new DynamicSelectModel({
        id: 'icon',
        label: 'Icon',
        options: []
      }),

    ],
  }),

  new DynamicInputModel({
    id: 'title_en',
    label: 'Title',
    validators: {
      required: null
    },
    errorMessages: {
      required: '{{label}} is required.'
    }
  }),

  new DynamicFormGroupModel({
    id: 'english',
    legend: 'English',
    group: [
      new DynamicInputModel({
        id: 'display_title_en',
        label: 'English Display Title',
      }),
      new DynamicTextAreaModel({
        id: 'body_en',
        label: 'English Body',
        value: '',
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
        hidden: true
      }),
      new DynamicInputModel({
        id: 'display_title_es',
        label: 'Spanish Display Title',
      }),
      new DynamicTextAreaModel({
        id: 'body_es',
        label: 'Spanish Body',
        value: '',
      }),
    ],
  }),

];

export const TRIAGE_ENTRY_FORM_LAYOUT = {
  'top': {
    grid: {
      container: 'pad ui-g-12',
      control: 'ui-g',
    }
  },
  'lang': {
    grid: {
      container: 'margin-right-lg',
    }
  },
  'icon': {
    element: {
      control: 'hide',
      label: 'hide'
    }
  },
  'title_en': {
    grid: {
      container: 'pad ui-g-12',
      label: 'required'
    }
  },
  'english': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'body_en': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'body_es': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
};
