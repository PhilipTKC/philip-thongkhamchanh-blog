import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);

export class HumanReadableDateValueConverter {
  toView(date: string): string {
    return dayjs(date).format("LL");
  }
}
