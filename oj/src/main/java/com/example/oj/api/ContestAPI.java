package com.example.oj.api;

import com.example.oj.constant.Constant;
import com.example.oj.constant.Utils;
import com.example.oj.document.ContestDocument;
import com.example.oj.document.DetailContest;
import com.example.oj.document.ProblemDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.*;
import com.example.oj.service.ContestService;
import com.example.oj.service.DetailContestService;
import com.example.oj.service.ProblemService;
import com.example.oj.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.rmi.MarshalledObject;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/contest")
@RequiredArgsConstructor
public class ContestAPI {
    private final Utils utils;
    private final ContestService contestService;
    private final ProblemService problemService;
    private final UserService userService;
    private final DetailContestService detailContestService;
    @PostMapping("/add")
    public ResponseEntity<ContestDocument> insert(@RequestHeader("Authorization") String authorizationHeader, @RequestBody ContestDocument contestDocument) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            contestDocument.setId(null);
            contestDocument.setCreatedBy(email);
            contestDocument.setCreatedAt(LocalDateTime.now().toString());
            contestDocument.setFinished(false);
            return ResponseEntity.ok(contestService.insert(contestDocument));
        }
        return null;
    }

    @GetMapping("/get-by-creator/{pageNumber}")
    public ResponseEntity<List<ContestDocument>> getOne(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Integer pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            List<ContestDocument> contestDocumentList = contestService.getOne(email, pageNumber);
            return ResponseEntity.ok(contestDocumentList);
        }
        return null;
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> countContest(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(contestService.countByCreatedBy(email));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ContestDocument> findOne(@PathVariable String id) {
        return ResponseEntity.ok(contestService.findOne(id));
    }

    @PutMapping("/update")
    public void update(@RequestBody ContestDocument contestDocument) {
        contestService.update(contestDocument);
    }

    @GetMapping("/get-challenges/{id}/{pageNumber}")
    public ResponseEntity<List<ProblemSmall>> getChallenges(@PathVariable String id, @PathVariable Integer pageNumber) {
        ContestDocument contestDocument = contestService.findOne(id);
        List<ProblemSmall> problems = new ArrayList<>();
        int pageSize = 10;
        int start = pageNumber * pageSize;
        int end = (pageSize + start - 1) <= contestDocument.getProblems().size() - 1 ? pageSize + start - 1 : contestDocument.getProblems().size() - 1;
        for(int i = start; i <= end; i++) {
            TaskContest task = contestDocument.getProblems().get(i);
            Optional<ProblemDocument> problemDocument = problemService.findOne(task.getId());
            if(problemDocument.isPresent()) {
                ProblemSmall problemSmall = new ProblemSmall().convert(problemDocument.get());
                problemSmall.setPoint(task.getPoint());
                problems.add(problemSmall);
            }
            else {
                ProblemSmall problemSmall = new ProblemSmall();
                problemSmall.setPoint(task.getPoint());
                problemSmall.setTitle("Đã bị xóa");
                problems.add(problemSmall);
            }
        }
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/get-participants/{id}/{pageNumber}")
    public ResponseEntity<List<UserDocument>> getParticipants(@PathVariable String id, @PathVariable Integer pageNumber) {
        ContestDocument contestDocument = contestService.findOne(id);
        List<UserDocument> participants = new ArrayList<>();
        int pageSize = 20;
        int start = pageNumber * pageSize;
        int end = (pageSize + start - 1) <= contestDocument.getParticipants().size() - 1 ? start + pageSize - 1 : contestDocument.getParticipants().size() - 1;
        for(int i = start; i <= end; i++) {
            UserDocument userDocument = userService.findOneByEmail(contestDocument.getParticipants().get(i).getEmail());
            if(userDocument != null) {
                participants.add(userDocument);
            }
            else {
                userDocument = new UserDocument();
                userDocument.setEmail(contestDocument.getParticipants().get(i).getEmail());
                userDocument.setName("User đã bị xóa");
                userDocument.setFaculty("");
                userDocument.setClassname("");
                participants.add(userDocument);
            }
        }
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/get-signups/{id}/{pageNumber}")
    public ResponseEntity<List<UserDocument>> getSignUps(@PathVariable String id, @PathVariable Integer pageNumber) {
        ContestDocument contestDocument = contestService.findOne(id);
        List<UserDocument> signups = new ArrayList<>();
        if(contestDocument.getSignups() != null) {
            Collections.sort(contestDocument.getSignups(), new Comparator<SignUp>() {
                @Override
                public int compare(SignUp o1, SignUp o2) {
                    return o1.getStatus().equals("signedUp") ? -1 : (o2.getStatus().equals("signedUp") ? 1 : 0);
                }
            });
            int pageSize = 20;
            int start = pageNumber * pageSize;
            int end = (pageSize + start - 1) <= contestDocument.getSignups().size() - 1 ? start + pageSize - 1 : contestDocument.getSignups().size() - 1;
            for (int i = start; i <= end; i++) {
                UserDocument userDocument = userService.findOneByEmail(contestDocument.getSignups().get(i).getEmail());
                if(userDocument != null)
                    signups.add(userDocument);
                else {
                    userDocument = new UserDocument();
                    userDocument.setEmail(contestDocument.getParticipants().get(i).getEmail());
                    userDocument.setName("User đã bị xóa");
                    userDocument.setFaculty("");
                    userDocument.setClassname("");
                    signups.add(userDocument);
                }
            }
        }

        return ResponseEntity.ok(signups);
    }

    @PostMapping("/add-submission")
    public ResponseEntity<Map<String, String>> addSubmission(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Submission submission) {
        String email = utils.getEmailFromToken(authorizationHeader);
        DetailContest detailContest = detailContestService.insert(submission, email);
        Map<String, String> mp = new HashMap<>();
        mp.put("id", detailContest.getId());
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/get-submission/{id}")
    public ResponseEntity<DetailContest> getSubmission(@PathVariable String id) {
        Optional<DetailContest> detailContest = detailContestService.findById(id);
        if(detailContest.isPresent()) {
            return ResponseEntity.ok(detailContest.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/get-all-submission/{contestId}/{pageNumber}")
    public ResponseEntity<List<DetailContest>> getAllSubmission(@PathVariable String contestId, @PathVariable int pageNumber) {
        List<DetailContest> detailContestList = detailContestService.getAll(contestId, pageNumber);
        return ResponseEntity.ok(detailContestList);
    }

    @GetMapping("/get-my-submission/{contestId}/{pageNumber}")
    public ResponseEntity<List<DetailContest>> getMySubmission(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String contestId, @PathVariable int pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        String userId = Constant.getId(email);
        List<DetailContest> detailContestList = detailContestService.getByContestIdAndUserId(contestId, userId, pageNumber);
        return ResponseEntity.ok(detailContestList);
    }

    @GetMapping("/get-submission-of-problem/{contestId}/{problemId}/{pageNumber}")
    public ResponseEntity<List<DetailContest>> getSubmissionOfProblem(@PathVariable String contestId, @PathVariable String problemId, @PathVariable int pageNumber) {
        List<DetailContest> detailContestList = detailContestService.getByContestIdAndProblemId(contestId, problemId, pageNumber);
        return ResponseEntity.ok(detailContestList);
    }

    @GetMapping("/count-submissions-contest/{contestId}/{userId}/{problemId}")
    public ResponseEntity<Map<String, Integer>> countSubmissionsContest(@PathVariable String contestId,@PathVariable String userId, @PathVariable String problemId){
        return ResponseEntity.ok(detailContestService.countSubmissions(contestId, userId, problemId));
    }

    @GetMapping("/get-leader-board/{contestId}/{pageNumber}")
    public ResponseEntity<List<LeaderBoard>> getLeaderBoard(@PathVariable String contestId, @PathVariable Integer pageNumber) {
        return ResponseEntity.ok(detailContestService.getLeaderBoard(contestId, pageNumber));
    }

    @GetMapping("/count-leader-board/{contestId}")
    public ResponseEntity<StatisticContest> countLeaderBoard(@PathVariable String contestId){
        return ResponseEntity.ok(detailContestService.countLeaderBoard(contestId));
    }

    @GetMapping("/get-detail-leaderboard/{contestId}/{userId}")
    public ResponseEntity<List<DetailLeaderboard>> getDetailLeaderboard(@PathVariable String contestId, @PathVariable String userId) {
        return ResponseEntity.ok(detailContestService.getDetailLeaderboard(contestId, userId));
    }

    @GetMapping("/get-contest-list/{pageNumber}/{isFinished}")
    public ResponseEntity<List<ContestDocument>> getContestList(@PathVariable Integer pageNumber, @PathVariable boolean isFinished) {
        List<ContestDocument> contestDocumentList = contestService.getContestList(isFinished, pageNumber);
        return ResponseEntity.ok(contestDocumentList);
    }

    @GetMapping("/count-contest/{isFinished}")
    public ResponseEntity<Map<String, Integer>> countContestList(@PathVariable boolean isFinished) {
        return ResponseEntity.ok(contestService.countContestList(isFinished));
    }

    @GetMapping("/get-statistic-contest/{contestId}")
    public ResponseEntity<StatisticContest> getStatisticContest(@PathVariable String contestId) {
        return ResponseEntity.ok(detailContestService.getStatisticNumber(contestId));
    }

    @GetMapping("/get-statistic-list/{contestId}")
    public ResponseEntity<List<Statistic>> getStatisticList(@PathVariable String contestId) {
        return ResponseEntity.ok(detailContestService.getStatisticBoard(contestId));
    }

    @GetMapping("/get-history-contest/{pageNumber}")
    public ResponseEntity<List<ContestDocument>> getHistoryContest(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Integer pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(contestService.getHistoryContest(email, pageNumber));
    }

    @GetMapping("/count-history-contest")
    public ResponseEntity<Map<String, Integer>> countHistoryContest(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(contestService.countHistoryContest(email));
    }

    @GetMapping("/get-top-rating/{contestId}")
    public ResponseEntity<TopRating> getTopRating(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String contestId) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(detailContestService.getTopRating(contestId, Constant.getId(email)));
    }


    // administration
    @GetMapping("/admin/get-contest-of-creator/{pageNumber}")
    public ResponseEntity<List<Map<String, Object>>> getContestOfCreator(@PathVariable int pageNumber) {
        return ResponseEntity.ok(contestService.getContestOfCreator(pageNumber));
    }

    @GetMapping("/admin/count-contest-of-creator")
    public ResponseEntity<Map<String, Integer>> countContestOfCreator() {
        return ResponseEntity.ok(contestService.countContestOfCreator());
    }

    @GetMapping("/admin/get-contests-creator/{email}/{pageNumber}")
    public ResponseEntity<List<Map<String, Object>>> getContestsCreator(@PathVariable String email, @PathVariable int pageNumber) {
        return ResponseEntity.ok(contestService.getContestsCreator(email, pageNumber));
    }

    @GetMapping("/admin/count-contests-creator/{email}")
    public ResponseEntity<Map<String, Integer>> countByCreatedBy(@PathVariable String email) {
        return ResponseEntity.ok(contestService.countByCreatedBy(email));
    }

    @DeleteMapping("/delete/{contestId}")
    public ResponseEntity<Map<String, String>> deleteContest(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String contestId) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            Map<String, String> mp = contestService.deleteContest(email, contestId);
            return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
