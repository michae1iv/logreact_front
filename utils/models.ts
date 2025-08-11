export const permissions = ['none', 'r', 'w', 'rw'];

export interface Rights {
    rule: string;
    list: string;
    admin: boolean;
}
export const Rights = undefined;

export interface Group {
    id: number;
    groupname: string;
    desc: string
    is_active: boolean;
    perm: Rights;
}
export const Group = undefined;

export interface User {
    id: number;
    password: string;
    fullname: string;
    email: string;
    username: string;
    group: string;
    is_active: boolean;
    cpofl: boolean;
}
export const User = undefined;

export interface AdminInfo {
    users: number;
    groups: number;
    lists: number;
    rules: number;
    alerts: number;
    sources: number;
}
export const AdminInfo = undefined;

export interface List {
    id: number;
    name: string;
    desc: string;
    list: string[];
}
export const List = undefined;

export interface Regs {
    id: number;
    name: string;
    desc: string;
    list: string[];
}
export const Regs = undefined;

export interface Step {
    logic: string;
    freq?: string;
    times?: number;
    then?: Step;
    otherwise?: Step;
}
export const Step = undefined;

export interface Params {
    ttl: string;
    sev_level: number;
    desc: string;
    no_alert: boolean;
}
export const Params = undefined;

export interface AddFields {

}
export const AddFields = undefined;

export interface Alert {
    fields: string[];
    addfields: AddFields;
}
export const Alert = undefined;

export interface Rule {
    id: number
    rule: string;
    ukey: string;
    params: Params;
    condition: Step;
    alert: Alert;
}