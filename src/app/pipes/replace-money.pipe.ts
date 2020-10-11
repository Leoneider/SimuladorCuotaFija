import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceMoney'
})
export class ReplaceMoneyPipe implements PipeTransform {
  transform(item: string, replace:string, replacement:string): string {
    if(item == null) return "";
    item = item.split(replace).join(replacement);
    return item;
  }

}
