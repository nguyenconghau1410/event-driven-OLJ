package com.example.judge.model;

import lombok.Data;

@Data
public class Execute {
    private String output;
    private double time;
    private double memory;
    private String result;
    private String compilerReport;
}
