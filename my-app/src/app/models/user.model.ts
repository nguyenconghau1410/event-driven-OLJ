import { Role } from "./role.model";

export interface User {
    id: string,
    email: string,
    name: string,
    tag: string,
    avatar: string,
    faculty: string,
    classname: string,
    role?: Role
}