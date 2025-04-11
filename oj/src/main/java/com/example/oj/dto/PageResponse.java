package com.example.oj.dto;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse {
    private List<ItemCount> total;
    private List<ProblemSmall> pagedProblemResults;

    @Data
    public class ItemCount {
        private Long totalCount;
    }
}
