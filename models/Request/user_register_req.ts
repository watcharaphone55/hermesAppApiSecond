// To parse this data:
//
//   import { Convert, UserRegisterReq } from "./file";
//
//   const userRegisterReq = Convert.toUserRegisterReq(json);

export interface UserRegisterReq {
    phone:    string;
    name:     string;
    password: string;
    address:  string;
    lat:      number;
    lng:      number;
    picture:  string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUserRegisterReq(json: string): UserRegisterReq {
        return JSON.parse(json);
    }

    public static userRegisterReqToJson(value: UserRegisterReq): string {
        return JSON.stringify(value);
    }
}
