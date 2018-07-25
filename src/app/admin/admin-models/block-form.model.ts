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

export const BLOCK_FORM: DynamicFormControlModel[] = [

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
        id: 'type',
        label: 'Type',
        options: []
      }),

      new DynamicSelectModel({
        id: 'style',
        label: 'Style',
        options: [
          {
            label: 'Choose Style',
            value: ''
          },
          {
            label: 'Drop Shadow',
            value: 'drop'
          },
          {
            label: 'Alert',
            value: 'alert'
          },
          {
            label: 'Home Large',
            value: 'home_lg'
          },
          {
            label: 'Home Small',
            value: 'home_sm'
          },
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
      new DynamicTextAreaModel({
        id: 'body_en',
        label: 'English Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'link_en',
        label: 'English Link',
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
        hidden: true
      }),
      new DynamicTextAreaModel({
        id: 'body_es',
        label: 'Spanish Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'link_es',
        label: 'Spanish Link',
      }),
      new DynamicInputModel({
        id: 'node_ref_es',
        label: 'Spanish Node References',
      }),
    ],
  }),

  new DynamicInputModel({
    id: 'image',
    label: 'Images',
    inputType: 'file',
  }),

  /*new DynamicInputModel({
    id: 'phone',
    label: 'Phone',
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  }),*/

];

export const BLOCK_FORM_LAYOUT = {
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
  'type': {
    grid: {
      container: 'margin-right-lg',
    }
  },
  'style': {
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
  'link_en': {
    element: {
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
  'body_es': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'link_es': {
    element: {
      container: 'margin-bottom'
    }
  },
  'node_ref_es': {
    element: {
      control: 'hide'
    }
  },
  'image': {
    grid: {
      container: 'pad ui-g-12',
    }
  },
};
