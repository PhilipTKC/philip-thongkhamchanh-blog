export class TimeToReadValueConverter {
  toView(inputLength: number): string {
    const time = Math.trunc(Math.floor(inputLength / 300) * .60);
    return `${time > 0 ? time : `< 1`} min read`;
  }
}
