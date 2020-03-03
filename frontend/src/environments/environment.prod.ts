import { ToolTip } from 'src/app/interfaces/tool-tip';

export const environment = {
  production: true,
  apiUrl: '84.88.187.151:8080'

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
    value: "Double click to open in new window or right to more information",
    position: "above",
    class: null
  }