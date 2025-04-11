import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProblemsComponent } from './problems/problems.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailProblemComponent } from './detail-problem/detail-problem.component';
import { CreateProblemComponent } from './profile/create-problem/create-problem.component';
import { SubmitComponent } from './submit/submit.component';
import { ResultComponent } from './result/result.component';
import { AdministrationComponent } from './administration/administration.component';
import { EditProblemComponent } from './profile/edit-problem/edit-problem.component';
import { MyContestComponent } from './my-contest/my-contest.component';
import { CreateContestComponent } from './my-contest/create-contest/create-contest.component';
import { DetailContestComponent } from './my-contest/detail-contest/detail-contest.component';
import { LandingPageComponent } from './my-contest/landing-page/landing-page.component';
import { ChallengesComponent } from './my-contest/challenges/challenges.component';
import { ResultContestComponent } from './my-contest/result-contest/result-contest.component';
import { SubmissionContestComponent } from './my-contest/submission-contest/submission-contest.component';
import { MySubmissionProblemComponent } from './submissions/my-submission-problem/my-submission-problem.component';
import { LeaderBoardComponent } from './my-contest/leader-board/leader-board.component';
import { DetailRatingComponent } from './my-contest/detail-rating/detail-rating.component';
import { ContestComponent } from './contest/contest.component';
import { MySubmissionComponent } from './profile/my-submission/my-submission.component';
import { HistoryContestComponent } from './profile/history-contest/history-contest.component';
import { OthersComponent } from './others/others.component';
import { AdminComponent } from './admin/admin.component';
import { ProblemManageComponent } from './admin/problem-manage/problem-manage.component';
import { UserManageComponent } from './admin/user-manage/user-manage.component';
import { ContestManageComponent } from './admin/contest-manage/contest-manage.component';
import { DetailContestCreatorComponent } from './admin/detail-contest-creator/detail-contest-creator.component';
import { DetailProblemManageComponent } from './admin/detail-problem-manage/detail-problem-manage.component';
import { CategoriesManageComponent } from './admin/categories-manage/categories-manage.component';
import { TestcaseManageComponent } from './admin/testcase-manage/testcase-manage.component';

export const routes: Routes = [
    { path: '', component: ProblemsComponent},
    { path: 'login', component: LoginComponent },
    { path: 'administration', component: AdministrationComponent },
    { path: 'problems', component: ProblemsComponent },
    { path: 'problems/:problemId', component: DetailProblemComponent },
    { path: 'problems/:problemId/submit', component: SubmitComponent },
    { path: 'submissions', component: SubmissionsComponent },
    { path: 'submissions/:id', component: ResultComponent },
    { path: 'problems/:problemId/my-submissions', component: MySubmissionProblemComponent },
    { path: 'problems/:problemId/all-submissions', component: MySubmissionProblemComponent },
    { path: 'users', component: UsersComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'users/:id', component: OthersComponent },
    { path: 'history-contest', component: HistoryContestComponent },
    { path: 'my-submission', component: MySubmissionComponent },
    { path: 'administration/create-problem', component: CreateProblemComponent },
    { path: 'administration/edit-problem/:id', component: EditProblemComponent },
    { path: 'my-contest', component: MyContestComponent },
    { path: 'my-contest/create-contest', component: CreateContestComponent },
    { path: 'my-contest/edit-contest/:id', component: DetailContestComponent },
    { path: 'landing/:id', component: LandingPageComponent },
    { path: 'contests/:id/challenges', component: ChallengesComponent },
    { path: 'contests/:id/challenges/:problemId', component: ChallengesComponent },
    { path: 'contests/:id/challenges/:problemId/submit', component: SubmitComponent },
    { path: 'contests/:submissionId', component: ResultContestComponent },
    { path: 'contests/:id/all-submission', component: SubmissionContestComponent },
    { path: 'contests/:id/my-submission', component: SubmissionContestComponent },
    { path: 'contests/:id/:problemId', component: SubmissionContestComponent },
    { path: 'contests/:id/leaderboard/all', component: LeaderBoardComponent },
    { path: 'contests/:id/leaderboard/:userId', component: DetailRatingComponent },
    { path: 'contests', component: ContestComponent },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'problems', component: ProblemManageComponent },
            { path: 'members', component: UserManageComponent },
            { path: 'contests', component: ContestManageComponent },
            { path: 'contests/:userId', component: DetailContestCreatorComponent },
            { path: 'problems/:problemId', component: DetailProblemManageComponent },
            { path: 'categories', component: CategoriesManageComponent },
            { path: 'testcases', component: TestcaseManageComponent },
            { path: '', redirectTo: 'categories', pathMatch: 'full' }
        ]
    },
];
