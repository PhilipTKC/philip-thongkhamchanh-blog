export class TimeToReadValueConverter {
  toView(inputLength: number): string {
    return `${Math.trunc(Math.floor(inputLength / 300) * .60)} min read`;
  }
}
