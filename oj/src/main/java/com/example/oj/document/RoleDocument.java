package com.example.oj.document;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "role")
@Data
public class RoleDocument {
    private String id;
    private String name;
    private String code;
}
