/*
 ** Pages - Total amount of pages that data generator has created.
 ** currentPage - The current page the user has navigated to.
 ** Traverse backwards from the current page to retrieve the previous 2 pages.
 ** Traverse forwards from the current page to retrieve the next 2 pages.
 ** Reverse previousTwo to ensure order is correct.
 */

export class PaginatorValueConverter {
  toView(pages: number, currentPage: number): number[] {
    const previousTwo: number[] = [];
    for (let i = currentPage - 1; currentPage >= currentPage - 3; i -= 1) {
      if (i === 0 || i === currentPage - 3) {
        break;
      }
      previousTwo.push(i);
    }

    const nextTwo: number[] = [];
    for (let i = currentPage + 1; currentPage < currentPage + 3; i += 1) {
      if (i > pages || i === currentPage + 3) {
        break;
      }
      nextTwo.push(i);
    }

    return [...previousTwo.reverse(), currentPage, ...nextTwo];
  }
}
