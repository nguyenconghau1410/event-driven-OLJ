import { Contest } from "./contest.model";
import { Problem } from "./problem.model";

export interface Submit {
    problem?: Problem;
    contest?: Contest,
    code: string;
    language: string;
    timeLimit: number;
    memoryLimit: number;
}