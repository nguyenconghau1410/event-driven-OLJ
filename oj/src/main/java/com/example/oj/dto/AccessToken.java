package com.example.oj.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccessToken {
    private String access_token;
}
