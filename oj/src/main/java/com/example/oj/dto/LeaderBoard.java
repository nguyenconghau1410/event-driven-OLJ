package com.example.oj.dto;

import lombok.Data;

@Data
public class LeaderBoard {
    private String id;
    private Float totalScore;
    private int totalSolutions;
    private String name;
}

