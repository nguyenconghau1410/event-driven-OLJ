package com.example.oj.dto;

import com.example.oj.document.ProblemDocument;
import lombok.Data;

@Data
public class ProblemSmall {
    private String id;
    private String title;
    private Long total;
    private Long totalAC;
    private String difficulty;
    private String state;
    private String email;
    private int point;
    private int testcase;
    public ProblemSmall convert(ProblemDocument problemDocument) {
        ProblemSmall problemSmall = new ProblemSmall();
        problemSmall.setId(problemDocument.getId());
        problemSmall.setTitle(problemDocument.getTitle());
        problemSmall.setState(problemDocument.getState());
        problemSmall.setEmail(problemDocument.getEmail());
        problemSmall.setTestcase(problemDocument.getTestcase().size());
        return problemSmall;
    }
}
