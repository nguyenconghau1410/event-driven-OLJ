package com.example.oj.dto;

import com.example.oj.document.DetailContest;
import com.example.oj.document.SubmissionDocument;
import lombok.Data;

@Data
public class DetailLeaderboard {
    private DetailContest document;
    private SubmissionDocument submission;
}
