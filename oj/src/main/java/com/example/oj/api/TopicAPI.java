package com.example.oj.api;

import com.example.oj.constant.Utils;
import com.example.oj.document.TopicDocument;
import com.example.oj.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/topic")
@RequiredArgsConstructor
public class TopicAPI {
    private final TopicService topicService;
    private final Utils utils;
    @PostMapping("/add")
    public ResponseEntity<TopicDocument> insert(@RequestBody TopicDocument topicDocument) {
        TopicDocument document = topicService.insert(topicDocument);
        if(document == null)
            return ResponseEntity.status(409).build();
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@RequestHeader("Authorization") String header ,@PathVariable String id) {
        String email = utils.getEmailFromToken(header);
        Map<String, String> mp = topicService.delete(email, id);
        return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/find-all")
    public ResponseEntity<List<TopicDocument>> findAll() {
        return ResponseEntity.ok(topicService.findAll());
    }

    @GetMapping("/get-topic-of-problem/{id}")
    public ResponseEntity<List<TopicDocument>> getTopic(@PathVariable String id) {
        return ResponseEntity.ok(topicService.findByProblemId(id));
    }
}
