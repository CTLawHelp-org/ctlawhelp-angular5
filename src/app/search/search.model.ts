export class Model {
  key = '';
  spelling = [];
  new_key = '';
  show_overflow = false;
  overflow_loading = false;
  processed = false;
  search = {
    segments: [],
    pages: [],
    overflow: [],
    triage: []
  };
}
