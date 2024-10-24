// To parse this data:
//
//   import { Convert } from "./file";
//
//   const selectRiderPhone = Convert.toSelectRiderPhone(json);

export interface SelectRiderPhone {
    phone: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSelectRiderPhone(json: string): SelectRiderPhone[] {
        return JSON.parse(json);
    }

    public static selectRiderPhoneToJson(value: SelectRiderPhone[]): string {
        return JSON.stringify(value);
    }
}
