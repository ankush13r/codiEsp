import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightBreakLine'
})
export class HighlightBreakLine implements PipeTransform {

  transform(value: string): any {
    if (!value) {
      return null;
    }

    var newText = ""
    for (let i = 0; i < value.length; i++) {

      if (value[i] == "\n")
        newText += "<mark>\n</mark>"
      else
        newText += value[i]
    }

    return newText + "\n";
  }
  
}



