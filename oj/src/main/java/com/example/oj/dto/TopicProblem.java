package com.example.oj.dto;

import com.example.oj.document.ProblemDocument;
import com.example.oj.document.TopicDocument;
import lombok.Data;

import java.util.List;

@Data
public class TopicProblem {
    private ProblemDocument problem;
    private List<TopicDocument> topics;
}
