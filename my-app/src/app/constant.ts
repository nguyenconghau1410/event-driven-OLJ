import { HttpHeaders } from "@angular/common/http"
import CryptoJS from 'crypto-js';

const BASE_URL =
    (window as any)?.env?.BASE_URL && !window.env.BASE_URL.includes("${")
        ? window.env.BASE_URL
        : "http://localhost:8088/api/v1";
const SECRET_KEY = (window as any)?.env?.SECRET_KEY && !window.env.SECRET_KEY.includes("${")
    ? window.env.SECRET_KEY : "";
export const API_URL = {
    login: BASE_URL + "/auth/authenticate",
    getUser: BASE_URL + "/users/get",
    getUserById: BASE_URL + "/users/get-by-id",
    updateUser: BASE_URL + "/users/update",
    getUserEmail: BASE_URL + "/users/get-by-email",
    getUserInfo: BASE_URL + "/users/get-info-user",
    getAllTopic: BASE_URL + "/topic/find-all",
    getTopicOfProblem: BASE_URL + "/topic/get-topic-of-problem",
    addProblem: BASE_URL + "/problem/add",
    getAllProblem: BASE_URL + "/problem/get-all",
    getProblem: BASE_URL + "/problem/get",
    deleteByProblemId: BASE_URL + "/problem/delete",
    getTotalRecordProblem: BASE_URL + "/problem/get-total-document",
    countProblemByCreator: BASE_URL + "/problem/count-by-creator",
    getProblemByCreator: BASE_URL + "/problem/get-by-creator",
    getProblemByKeyword: BASE_URL + "/problem/get-by-keyword",
    getSearchProblem: BASE_URL + "/problem/search",
    updateState: BASE_URL + "/problem/update-state",
    updateProblem: BASE_URL + "/problem/update",
    uploadFile: BASE_URL + "/file/upload-file",
    deleteFolder: BASE_URL + "/file/delete-folder",
    submit: BASE_URL + "/submission/submit",
    getFigure: BASE_URL + "/submission/get-figure",
    getACList: BASE_URL + "/submission/get-ac-list",
    countACList: BASE_URL + "/submission/count-ac-list",
    getSubmission: BASE_URL + "/submission/result",
    countMySubmissions: BASE_URL + "/submission/count-my-submission",
    getMySubmisisons: BASE_URL + "/submission/get-my-submission",
    countTotalSubmissions: BASE_URL + "/submission/count-total-submissions",
    getAllSubmission: BASE_URL + "/submission/get-all",
    countSubmissionProblem: BASE_URL + "/submission/count-submissions-problem",
    getSubmissionOfProblem: BASE_URL + "/submission/get-submission-of-problem",
    getSubmissionByProblem: BASE_URL + "/submission/get-by-problemId",
    getStatistic: BASE_URL + "/submission/get-statistic",
    getLeaderboardUser: BASE_URL + "/submission/get-leaderboard-user",
    countAllUser: BASE_URL + "/submission/count-all-user",
    addContest: BASE_URL + "/contest/add",
    getContestByCreator: BASE_URL + "/contest/get-by-creator",
    getContest: BASE_URL + "/contest/get",
    countContest: BASE_URL + "/contest/count",
    updateContest: BASE_URL + "/contest/update",
    getChallenges: BASE_URL + "/contest/get-challenges",
    getParticipants: BASE_URL + "/contest/get-participants",
    getSignups: BASE_URL + "/contest/get-signups",
    addSubmissionContest: BASE_URL + "/contest/add-submission",
    countSubmissionsContest: BASE_URL + "/contest/count-submissions-contest",
    getSubmissionContest: BASE_URL + "/contest/get-submission",
    getAllSubmissionOfContest: BASE_URL + "/contest/get-all-submission",
    getMySubmissionOfContest: BASE_URL + "/contest/get-my-submission",
    getSubmissionOfProblemInContest: BASE_URL + "/contest/get-submission-of-problem",
    getLeaderBoardList: BASE_URL + "/contest/get-leader-board",
    getDetailLeaderboard: BASE_URL + "/contest/get-detail-leaderboard",
    getContestList: BASE_URL + "/contest/get-contest-list",
    countContestList: BASE_URL + "/contest/count-contest",
    getStatisticContest: BASE_URL + "/contest/get-statistic-contest",
    getStatisticListContest: BASE_URL + "/contest/get-statistic-list",
    countLeaderBoard: BASE_URL + "/contest/count-leader-board",
    countHistoryContest: BASE_URL + "/contest/count-history-contest",
    getHistoryContest: BASE_URL + "/contest/get-history-contest",
    getTopRating: BASE_URL + "/contest/get-top-rating"
}
export const API_URL_ADMIN = {
    getAllProblem: BASE_URL + '/problem/admin/get-all',
    countAllProblem: BASE_URL + '/problem/admin/get-total-document',
    getAllUsers: BASE_URL + "/users/admin/get-all",
    countAllUsers: BASE_URL + "/users/admin/count-all",
    deleteUser: BASE_URL + "/users/admin/delete",
    countContestOfCreator: BASE_URL + "/contest/admin/count-contest-of-creator",
    getContestOfCreator: BASE_URL + "/contest/admin/get-contest-of-creator",
    countContestsCreator: BASE_URL + "/contest/admin/count-contests-creator",
    getContestsCreator: BASE_URL + "/contest/admin/get-contests-creator",
    deleteContest: BASE_URL + "/contest/delete",
    getDetailProblem: BASE_URL + "/problem/admin/get-detail",
    deleteSubmissionsNotAC: BASE_URL + "/submission/admin/delete",
    addTopic: BASE_URL + "/topic/add",
    deleteTopic: BASE_URL + "/topic/delete",
    exchangeRole: BASE_URL + "/users/admin/exchange-role",
    searchUser: BASE_URL + "/users/admin/search",
    searchProblem: BASE_URL + "/problem/admin/search",
    getFolders: BASE_URL + "/file/get-folders"
}

export function decrypt(cipherText: string): string | null {
    try {
      if(SECRET_KEY === "") return cipherText;
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch (e) {
      console.error("Failed to decrypt token:", e);
      return null;
    }
}

export const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${decrypt(sessionStorage.getItem('access_token') as string)}`)





