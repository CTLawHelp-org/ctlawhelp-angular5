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

export const NSMI_FORM: DynamicFormControlModel[] = [

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
      new DynamicTextAreaModel({
        id: 'more_info_en',
        label: 'English More Info',
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
      new DynamicTextAreaModel({
        id: 'more_info_es',
        label: 'Spanish More Info',
        value: '',
      }),
    ],
  }),

  new DynamicInputModel({
    id: 'file',
    label: 'Icon',
    inputType: 'file',
  }),

  new DynamicSelectModel({
    id: 'parent',
    label: 'Parent',
    hidden: true,
  }),

];

export const NSMI_FORM_LAYOUT = {
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
  'more_info_en': {
    element: {
      control: 'editor',
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
  'more_info_es': {
    element: {
      control: 'editor',
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
    }
  },
};
