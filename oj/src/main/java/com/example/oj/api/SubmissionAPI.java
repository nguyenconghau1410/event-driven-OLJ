package com.example.oj.api;

import com.example.oj.constant.Utils;
import com.example.oj.document.SubmissionDocument;
import com.example.oj.dto.Statistic;
import com.example.oj.dto.StatisticContest;
import com.example.oj.dto.Submission;
import com.example.oj.dto.TopRating;
import com.example.oj.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/submission")
@RequiredArgsConstructor
public class SubmissionAPI {
    private final SubmissionService submissionService;
    private final Utils utils;
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> insert(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Submission submission) {
        String email = utils.getEmailFromToken(authorizationHeader);
        SubmissionDocument submissionDocument = submissionService.insert(submission, email);
        Map<String, String> mp = new HashMap<>();
        mp.put("id", submissionDocument.getId());
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<SubmissionDocument> execute(@PathVariable String id) {
        Optional<SubmissionDocument> submissionDocument = submissionService.execute(id);
        if(submissionDocument.isPresent()) {
            return ResponseEntity.ok(submissionDocument.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/get-submission-of-problem/{problemId}/{pageNumber}")
    public ResponseEntity<List<SubmissionDocument>> getSubmissionOfProblem(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String problemId, @PathVariable Integer pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        List<SubmissionDocument> submissionDocumentList =submissionService.getSubmissionOfProblem(problemId, email, pageNumber);
        return ResponseEntity.ok(submissionDocumentList);
    }

    @GetMapping("/count-submissions-problem/{problemId}/{type}")
    public ResponseEntity<Map<String, Integer>> countSubmissionProblem(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String problemId, @PathVariable String type) {
        Map<String, Integer> mp = new HashMap<>();
        String email = utils.getEmailFromToken(authorizationHeader);
        mp.put("total", submissionService.countSubmissionProblem(problemId, email, type));
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/get-my-submission/{pageNumber}")
    public ResponseEntity<List<SubmissionDocument>> getMySubmission(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Integer pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(submissionService.getSubmissionByUserId(email, pageNumber));
    }

    @GetMapping("/count-my-submission")
    public ResponseEntity<Map<String, Integer>> countMySubmission(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(submissionService.countMySubmission(email));
    }

    @GetMapping("/get-by-problemId/{problemId}/{pageNumber}")
    public ResponseEntity<List<SubmissionDocument>> getSubmissionOfProblem(@PathVariable String problemId, @PathVariable Integer pageNumber) {
        List<SubmissionDocument> submissionDocumentList = submissionService.getSubmissionByProblem(problemId, pageNumber);
        return ResponseEntity.ok(submissionDocumentList);
    }

    @GetMapping("/get-all/{pageNumber}")
    public ResponseEntity<List<SubmissionDocument>> getAll(@PathVariable Integer pageNumber) {
        return ResponseEntity.ok(submissionService.getAll(pageNumber));
    }

    @GetMapping("/count-total-submissions")
    public ResponseEntity<Map<String, Integer>> count() {
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", submissionService.count());
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/get-statistic")
    public ResponseEntity<List<Statistic>> getStatistic() {
        return ResponseEntity.ok(submissionService.getStatistic());
    }

    @GetMapping("/get-figure")
    public ResponseEntity<Map<String, Long>> getFigure(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(submissionService.getFigure(email));
    }

    @GetMapping("/get-leaderboard-user/{pageNumber}")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboardUser(@PathVariable Integer pageNumber) {
        return ResponseEntity.ok(submissionService.getTopUser(pageNumber));
    }
    @GetMapping("/count-all-user")
    public ResponseEntity<Map<String, Long>> countMySubmission() {
        return ResponseEntity.ok(submissionService.countAllUser());
    }

    @GetMapping("/get-ac-list/{userId}/{pageNumber}")
    public ResponseEntity<List<SubmissionDocument>> getACList(@PathVariable String userId, @PathVariable Integer pageNumber) {
        return ResponseEntity.ok(submissionService.getACList(userId, pageNumber));
    }

    @GetMapping("/count-ac-list/{userId}")
    public ResponseEntity<StatisticContest> countACList(@PathVariable String userId) {
        return ResponseEntity.ok(submissionService.countACList(userId));
    }

    @PostMapping("/test")
    public void test() throws IOException, InterruptedException {
        String src = "#include <stdio.h>\n" +
                "\n" +
                "#define MAXN 1000001\n" +
                "\n" +
                "int cnt[MAXN];\n" +
                "\n" +
                "int main() {\n" +
                "    int n;\n" +
                "    scanf(\"%d\", &n);\n" +
                "    int a[n - 1];\n" +
                "    \n" +
                "    for(int i = 0; i < n - 1; i++) {\n" +
                "        scanf(\"%d\", &a[i]);\n" +
                "    }\n" +
                "    \n" +
                "    for(int i = 0; i < n - 1; i++) {\n" +
                "        cnt[a[i]] = 1;\n" +
                "    }\n" +
                "    \n" +
                "    for(int i = 1; i <= n; i++) {\n" +
                "        if(cnt[i] == 0) {\n" +
                "            printf(\"%d \", i);\n" +
                "        }\n" +
                "    }\n" +
                "    \n" +
                "    return 0;\n" +
                "}";
        File file = new File("main.c");
        FileWriter writer = new FileWriter(file);
        writer.write(src);
        writer.close();

        ProcessBuilder processBuilder = new ProcessBuilder("gcc", "main.c", "-o", "a.exe");
        Process process = processBuilder.start();
        process.waitFor();

        if(process.exitValue() != 0) {
            System.out.println("COMPILATION ERROR");
            System.exit(0);
        }
        for (int i = 1; i <= 14; i++) {
            ProcessBuilder runBuilder = new ProcessBuilder("./a.exe");
            File inputFile = new File(".\\testcase\\cses-missing-number-Missing Number\\input\\" + i + ".in");
            runBuilder.redirectInput(inputFile);
            Process main = runBuilder.start();
            BufferedReader inputReader = new BufferedReader(new InputStreamReader(main.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = inputReader.readLine()) != null) {
                output.append(line).append("\n");
            }
            System.out.println(output.toString());
        }

        file.delete();
    }

    // administration

    @DeleteMapping("/admin/delete/{problemId}")
    public ResponseEntity<Map<String, String>> deleteSubmissions(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String problemId) {
        String email = utils.getEmailFromToken(authorizationHeader);
        Map<String, String> mp = submissionService.deleteSubmissionsNotAC(problemId, email);
        return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
