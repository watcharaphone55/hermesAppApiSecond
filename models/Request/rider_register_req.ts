// To parse this data:
//
//   import { Convert, RiderRegisterReq } from "./file";
//
//   const riderRegisterReq = Convert.toRiderRegisterReq(json);

export interface RiderRegisterReq {
    phone:    string;
    name:     string;
    password: string;
    picture : string;
    plate:    string;
    type:     string
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRiderRegisterReq(json: string): RiderRegisterReq {
        return JSON.parse(json);
    }

    public static riderRegisterReqToJson(value: RiderRegisterReq): string {
        return JSON.stringify(value);
    }
}
