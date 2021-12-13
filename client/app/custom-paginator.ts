import { MatPaginator, MatPaginatorIntl } from '@angular/material';

export class CustomPaginator extends MatPaginatorIntl {
    constructor() {
      super();
      this.nextPageLabel = 'Sol. por pagina';
      this.previousPageLabel = 'Pagina anterior';
      this.itemsPerPageLabel = 'Sol. por Pagina';
      this.nextPageLabel = 'Sig. Pagina'
    }

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
          return '0 de ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        console.log(startIndex);
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
         return `${startIndex + 1} - ${endIndex} de ${length}`;
        //return startIndex + 1 + ' - ' + endIndex + ' do ' + length;
      };
  }

  