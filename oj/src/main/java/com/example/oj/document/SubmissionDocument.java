package com.example.oj.document;

import com.example.oj.dto.ResultTestCase;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "submission")
@Data
public class SubmissionDocument {
    @Id
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
