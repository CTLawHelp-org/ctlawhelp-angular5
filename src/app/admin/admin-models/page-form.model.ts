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

export const PAGE_FORM: DynamicFormControlModel[] = [

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
        options: [],
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{label}} is required.'
        }
      }),
      new DynamicSelectModel({
        id: 'reporting',
        label: 'Reporting',
        options: [],
        multiple: true
      }),
      new DynamicSelectModel({
        id: 'icon',
        label: 'Icon',
        options: []
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
      new DynamicInputModel({
        id: 'copy_en',
        label: 'English Copyright',
      }),
      new DynamicTextAreaModel({
        id: 'summary_en',
        label: 'English Summary',
        value: '',
      }),
      new DynamicTextAreaModel({
        id: 'body_en',
        label: 'English Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'segments_en',
        label: 'English Segments',
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
      new DynamicInputModel({
        id: 'copy_es',
        label: 'Spanish Copyright',
      }),
      new DynamicTextAreaModel({
        id: 'summary_es',
        label: 'Spanish Summary',
        value: '',
      }),
      new DynamicTextAreaModel({
        id: 'body_es',
        label: 'Spanish Body',
        value: '',
      }),
      new DynamicInputModel({
        id: 'segments_es',
        label: 'Spanish Segments',
      }),
    ],
  }),

  new DynamicInputModel({
    id: 'nsmi',
    label: 'Self-Help Category',
  }),

  new DynamicFormGroupModel({
    id: 'attachments',
    legend: 'Attachments',
    group: [
      new DynamicInputModel({
        id: 'file',
        label: 'Files',
        inputType: 'file',
      }),
      new DynamicInputModel({
        id: 'image',
        label: 'Images',
        inputType: 'file',
      }),
    ],
  }),

];

export const PAGE_FORM_LAYOUT = {
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
      label: 'required'
    }
  },
  'reporting': {
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
  'english': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'title_en': {
    element: {
      container: 'margin-bottom'
    },
    grid: {
      label: 'required'
    }
  },
  'copy_en': {
    element: {
      container: 'margin-bottom'
    }
  },
  'summary_en': {
    element: {
      container: 'sum-en margin-bottom'
    }
  },
  'body_en': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'segments_en': {
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
    element: {
      container: 'margin-bottom'
    },
    grid: {
      label: 'required'
    }
  },
  'copy_es': {
    element: {
      container: 'margin-bottom'
    }
  },
  'summary_es': {
    element: {
      container: 'sum-es margin-bottom'
    }
  },
  'body_es': {
    element: {
      control: 'editor',
      container: 'margin-bottom'
    }
  },
  'segments_es': {
    element: {
      control: 'hide'
    }
  },
  'nsmi': {
    grid: {
      container: 'pad ui-g-12',
    },
    element: {
      control: 'hide'
    }
  },
  'file': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'image': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
};
