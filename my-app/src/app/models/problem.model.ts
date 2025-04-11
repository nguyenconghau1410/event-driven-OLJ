import { User } from "./user.model";

export interface Problem {
    id: string;
    title: string;
    description: string;
    input: string;
    output: string;
    constraints: string;
    sample: { [key: string]: string }[];
    timeLimit: string;
    memoryLimit: string;
    difficulty: string;
    email: string;
    src: string;
    state: string;
    testcase: { [key: string]: string }[];


}