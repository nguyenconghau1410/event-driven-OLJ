package com.example.oj.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "problem")
@Data
public class ProblemDocument {
    @Id
    private String id;
    private String title;
    private String description;
    private String input;
    private String output;
    private String constraints;
    private List<Map<String, String>> sample;
    private String timeLimit;
    private String memoryLimit;
    private String difficulty;
    private String email;
    private String src;
    private String state;
    private String createdAt;
    private List<Map<String, String>> testcase;
}
