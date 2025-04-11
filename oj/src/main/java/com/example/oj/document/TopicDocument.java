package com.example.oj.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "topic")
@Data
public class TopicDocument {
    @Id
    private String id;
    private String name;
    private String code;
}
