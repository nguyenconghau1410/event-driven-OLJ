import { SignUp } from "./signup.model"

export interface Contest {
    id: string,
    title: string,
    description: string,
    startTime: string,
    hourStart: string
    endTime: string,
    hourEnd: string,
    problems: { id: string, point: number }[],
    signups: SignUp[],
    participants: { email: string, joined: boolean }[],
    state: string,
    mode: string,
    createdBy: string,
    finished: boolean,
    noTime: boolean,
}