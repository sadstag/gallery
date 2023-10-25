export type Outcome<T> =
  | {
      outcome: "success";
      data: T;
    }
  | {
      outcome: "error";
      message: string;
    };
