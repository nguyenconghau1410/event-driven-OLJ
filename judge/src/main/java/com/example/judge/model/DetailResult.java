package com.example.judge.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DetailResult {
    private String id;
    private String contestId;
    private String nameContest;
    private String problemId;
    private String title;
    private String userId;
    private String name;
    private String language;
    private String createdAt;
    private List<ResultTestCase> testcases = new ArrayList<>();
    private String result;
    private int rightTest;
    private int totalTest;
    private Float point;
    private Float maxScored;
    private Float time;
    private Float memory;
    private String compilerReport;
    private String source;
}
