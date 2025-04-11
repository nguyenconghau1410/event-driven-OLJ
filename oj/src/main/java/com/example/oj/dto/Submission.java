package com.example.oj.dto;

import com.example.oj.document.ContestDocument;
import com.example.oj.document.ProblemDocument;
import lombok.Data;

@Data
public class Submission {
    private ProblemDocument problem;
    private ContestDocument contest;
    private String code;
    private String language;
    private Float timeLimit;
    private Float memoryLimit;
}
