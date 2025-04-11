package com.example.judge.model;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SubmissionDocument {
    private String id;
    private String problemId;
    private String title;
    private String userId;
    private String name;
    private Float time;
    private Float memory;
    private List<ResultTestCase> testcases = new ArrayList<>();
    private String language;
    private String createdAt;
    private String result;
    private Integer rightTest;
    private Integer totalTest;
    private String compilerReport;
    private String source;
}
