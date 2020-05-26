import { ToolTip } from 'src/app/interfaces/tool-tip';

export const environment = {
  production: true,
  apiUrl: 'http://172.23.0.1/api'

};

export const toolTips: ToolTip = {
  //class maybe "tooltip-dark"
  nextDoc: {
    value: "Next document",
    position: "above",
    class: null
  },
  previousDoc: {
    value: "Previous document",
    position: "above",
    class: null
  },
  newCase: {
    value: "New clinical case",
    position: "above",
    class: null
  },
  editCase: {
    value: "Edit and create new version",
    position: "above",
    class: null
  },
  finishDoc: {
    value: "Finish with the document",
    position: "above",
    class: null
  },
  clear: {
    value: "Clean all inputs",
    position: "above",
    class: null
  },
  preview: {
    value: "Click to preview text",
    position: "above",
    class: null
  },
  paste: {
    value: "Click to paste",
    position: "above",
    class: null
  },
  listItem: {
    value: "Double click to open in new window or on the left icon",
    position: "above",
    class: null
  },
  hpo_terms: {
    value: "Add HPO (The Human Phenotype Ontology) terms related to the document.",
    position: "left",
    class: "tooltip-dark",
    delay: 200,
  }
}