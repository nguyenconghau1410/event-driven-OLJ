import { ResultTest } from "./result-test.model";

export interface DetailContest {
    id: string;
    contestId: string;
    nameContest: string;
    problemId: string;
    title: string;
    userId: string;
    name: string;
    language: string;
    createdAt: string;
    testcases: ResultTest[];
    result: string;
    rightTest: number;
    totalTest: number;
    point: number;
    maxScored: number,
    time: number;
    memory: number;
    compilerReport: string;
    source: string;
}