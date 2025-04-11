package com.example.oj.api;

import com.example.oj.constant.Utils;
import com.example.oj.document.ProblemDocument;
import com.example.oj.document.TopicDocument;
import com.example.oj.document.TopicProblemDocument;
import com.example.oj.dto.ProblemSmall;
import com.example.oj.dto.TopicProblem;
import com.example.oj.service.ProblemService;
import com.example.oj.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/problem")
@RequiredArgsConstructor
public class ProblemAPI {
    private final ProblemService problemService;
    private final TopicService topicService;
    private final Utils utils;
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> insert
            (@RequestHeader("Authorization") String authorizationHeader,
             @RequestBody TopicProblem topicProblem
             ) {
        Optional<ProblemDocument> check = problemService.findOne(topicProblem.getProblem().getId());
        Map<String, String> mp = new HashMap<>();
        if(check.isPresent()) {
            mp.put("Error", "ProblemID đã tồn tại!");
            return ResponseEntity.ok(mp);
        }
        ProblemDocument problemDocument = topicProblem.getProblem();
        List<TopicDocument> topics = topicProblem.getTopics();
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            problemDocument.setEmail(email);
        }
        problemDocument.setState("PRIVATE");
        problemDocument.setCreatedAt(LocalDateTime.now().toString());
        ProblemDocument problem = problemService.insert(problemDocument);
        for(var x : topics) {
            TopicProblemDocument topicProblemDocument = new TopicProblemDocument();
            topicProblemDocument.setProblemId(problem.getId());
            topicProblemDocument.setTopicId(x.getId());
            topicService.insert(topicProblemDocument);
        }
        mp.put("success", "ok");
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/get-all/{pageNumber}")
    public ResponseEntity<List<ProblemSmall>> getAllProblem(@PathVariable Integer pageNumber) {
        return ResponseEntity.ok(problemService.findAll(pageNumber));
    }

    @GetMapping("/get-total-document")
    public ResponseEntity<Map<String, Integer>> count() {
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", problemService.count());
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProblemDocument> getOne(@PathVariable String id) {
        Optional<ProblemDocument> problemDocument = problemService.findOne(id);
        if(problemDocument.isPresent()) {
            return ResponseEntity.ok(problemDocument.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/update-state/{id}")
    public void update(@PathVariable String id) {
        problemService.update(id);
    }

    @PutMapping("/update")
    public void updateProblem(@RequestBody TopicProblem topicProblem) {
        problemService.update(topicProblem);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteProblem(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String id) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(problemService.deleteProblem(id, email));
    }

    @GetMapping("/get-by-creator/{pageNumber}")
    public ResponseEntity<List<ProblemSmall>> getProblemByCreator(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int pageNumber) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(problemService.findByCreator(email, pageNumber));
    }

    @GetMapping("/count-by-creator")
    public ResponseEntity<Map<String, Integer>> countProblemByCreator(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(problemService.countByEmail(email));
    }

    @GetMapping("/get-by-keyword/{keyword}")
    public ResponseEntity<List<ProblemSmall>> findByKeyword(@PathVariable String keyword) {
        return ResponseEntity.ok(problemService.findByKeyword(keyword));
    }

    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(problemService.search(data));
    }


    // administration
    @GetMapping("/admin/get-all/{pageNumber}")
    public ResponseEntity<List<ProblemSmall>> getAll(@PathVariable Integer pageNumber) {
        return ResponseEntity.ok(problemService.findAllManage(pageNumber));
    }

    @GetMapping("/admin/get-total-document")
    public ResponseEntity<Map<String, Integer>> countAll() {
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", problemService.countAll());
        return ResponseEntity.ok(mp);
    }

    @GetMapping("/admin/get-detail/{problemId}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String problemId) {
        Map<String, Object> mp = problemService.getDetail(problemId);
        return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/admin/search/{keyword}/{pageNumber}")
    public ResponseEntity<Map<String, Object>> search(@PathVariable String keyword, @PathVariable int pageNumber) {
        Map<String, Object> mp = problemService.search(keyword, pageNumber);
        return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
