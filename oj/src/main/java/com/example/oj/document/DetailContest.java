package com.example.oj.document;

import com.example.oj.dto.ResultTestCase;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "detail_contest")
@Data
public class DetailContest {
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
