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

export const SEGMENT_FORM: DynamicFormControlModel[] = [

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
    ],
  }),

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
        id: 'sbody_en',
        label: 'English Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'node_ref_en',
        label: 'English Node References',
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
        id: 'sbody_es',
        label: 'Spanish Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'node_ref_es',
        label: 'Spanish Node References',
      }),
    ],
  }),

];

export const SEGMENT_FORM_LAYOUT = {
  'top': {
    grid: {
      container: 'pad ui-g-12',
      control: 'ui-g',
    }
  },
  'lang': {
    grid: {
      container: 'margin-right-lg',
      label: 'required'
    }
  },
  'title_en': {
    grid: {
      label: 'required'
    }
  },
  'english': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'sbody_en': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'node_ref_en': {
    element: {
      control: 'hide'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'title_es': {
    grid: {
      label: 'required'
    }
  },
  'sbody_es': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'node_ref_es': {
    element: {
      control: 'hide'
    }
  },
};
