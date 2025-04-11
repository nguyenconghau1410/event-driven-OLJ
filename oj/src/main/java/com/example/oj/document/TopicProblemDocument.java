package com.example.oj.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "topic_problem")
@Data
public class TopicProblemDocument {
    @Id
    private String id;
    private String topicId;
    private String problemId;
}
