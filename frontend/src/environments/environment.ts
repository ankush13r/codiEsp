import { ToolTip } from 'src/app/interfaces/tool-tip';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:5000'
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
    delay:200,
 }

}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
