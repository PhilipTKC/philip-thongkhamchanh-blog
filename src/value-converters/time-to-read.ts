export class TimeToReadValueConverter {
  toView(inputLength: number): string {
    return `${Math.ceil(inputLength / 250)} min read`;
  }
}
