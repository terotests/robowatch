/**
 * @redux true
 */
export class IncModel {
  cnt: number = 0;
  msg: string = "Also: Hello World!!!";
  increment() {
    this.cnt++;
  }
  decrement() {
    this.cnt--;
  }
}
