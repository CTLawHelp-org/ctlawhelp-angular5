export class Model {
  key = '';
  spelling = [];
  new_key = '';
  show_overflow = false;
  show_overflow_btn = false;
  overflow_loading = false;
  processed = false;
  search = {
    segments: [],
    pages: [],
    overflow: [],
    proc_overflow: [],
    triage: []
  };
}
