// To parse this data:
//
//   import { Convert, ToLoginUser } from "./file";
//
//   const toLoginUser = Convert.toToLoginUser(json);

export interface ToLoginUser {
    phone:    string;
    password: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toToLoginUser(json: string): ToLoginUser {
        return JSON.parse(json);
    }

    public static toLoginUserToJson(value: ToLoginUser): string {
        return JSON.stringify(value);
    }
}
