import { ResultTest } from "./result-test.model";

export interface Submission {
    id: string;
    problemId: string;
    title: string;
    userId: string;
    name: string;
    time: number;
    memory: number;
    testcases: ResultTest[];
    language: string;
    createdAt: string;
    result: string;
    rightTest: number;
    totalTest: number;
    compilerReport: number;
    source: string;
}