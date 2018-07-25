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

export const TRIAGE_FORM: DynamicFormControlModel[] = [

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
      new DynamicTextAreaModel({
        id: 'desc_en',
        label: 'English Description',
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
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
      new DynamicTextAreaModel({
        id: 'desc_es',
        label: 'Spanish Description',
        value: '',
      }),
    ],
  }),

  new DynamicInputModel({
    id: 'file',
    label: 'Icon',
    inputType: 'file',
  }),

  new DynamicInputModel({
    id: 'parent',
    label: 'Parent',
    hidden: true,
  }),

];

export const TRIAGE_FORM_LAYOUT = {
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
  'file': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
  'parent': {
    grid: {
      container: 'pad ui-g-12',
    },
    element: {
      control: 'hide'
    }
  },
};
