package com.example.oj.dto;

import lombok.Data;

@Data
public class Execute {
    private String output;
    private double time;
    private double memory;
    private String result;
    private String compilerReport;
}
