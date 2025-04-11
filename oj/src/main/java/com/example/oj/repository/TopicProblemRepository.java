package com.example.oj.repository;

import com.example.oj.document.TopicProblemDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TopicProblemRepository extends MongoRepository<TopicProblemDocument, String> {
    TopicProblemDocument insert(TopicProblemDocument document);
    List<TopicProblemDocument> findByProblemId(String problemId);
    Page<TopicProblemDocument> findByTopicId(String topicId, Pageable pageable);

    Integer countByTopicId(String topicId);

    void deleteByProblemId(String problemId);

    void deleteByTopicId(String topicId);
}
