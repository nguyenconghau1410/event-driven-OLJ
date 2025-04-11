package com.example.judge.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class Problem {
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
