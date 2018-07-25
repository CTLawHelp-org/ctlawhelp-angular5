import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicFormGroupModel,
  DynamicTextAreaModel,
  DynamicSelectModel,
  DynamicEditorModel, DynamicFormArrayModel,
} from '@ng-dynamic-forms/core';

export const PAGE_SETTINGS_FORM: DynamicFormControlModel[] = [

  new DynamicFormGroupModel({
    id: 'english',
    legend: 'English',
    group: [
      new DynamicInputModel({
        id: 'path_en',
        label: 'English Path',
      }),
      new DynamicInputModel({
        id: 'old_path_en',
        label: 'Alternative English Path(s)',
      }),
      new DynamicTextAreaModel({
        id: 'meta_en',
        label: 'English Meta Text (Search Index)',
        value: '',
      }),
      new DynamicInputModel({
        id: 'meta_title_en',
        label: 'English Meta Title',
      }),
      new DynamicTextAreaModel({
        id: 'meta_desc_en',
        label: 'English Meta Description',
        value: '',
      }),
    ],
  }),

  new DynamicFormGroupModel({
    id: 'spanish',
    legend: 'Spanish',
    group: [
      new DynamicInputModel({
        id: 'path_es',
        label: 'Spanish Path',
      }),
      new DynamicInputModel({
        id: 'old_path_es',
        label: 'Alternative Spanish Path(s)',
      }),
      new DynamicTextAreaModel({
        id: 'meta_es',
        label: 'Spanish Meta Text (Search Index)',
        value: '',
      }),
      new DynamicInputModel({
        id: 'meta_title_es',
        label: 'Spanish Meta Title',
      }),
      new DynamicTextAreaModel({
        id: 'meta_desc_es',
        label: 'Spanish Meta Description',
        value: '',
      }),
    ],
  }),

];

export const PAGE_SETTINGS_FORM_LAYOUT = {
  'english': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'meta_title_en': {
    element: {
      container: 'margin-bottom'
    }
  },
  'meta_en': {
    element: {
      container: 'margin-bottom'
    }
  },
  'path_en': {
    element: {
      container: 'margin-bottom'
    }
  },
  'old_path_en': {
    element: {
      container: 'margin-bottom'
    }
  },
  'spanish': {
    grid: {
      container: 'pad ui-g-12 ui-lg-6',
    }
  },
  'meta_title_es': {
    element: {
      container: 'margin-bottom'
    }
  },
  'meta_es': {
    element: {
      container: 'margin-bottom'
    }
  },
  'path_es': {
    element: {
      container: 'margin-bottom'
    }
  },
  'old_path_es': {
    element: {
      container: 'margin-bottom'
    }
  },
};
