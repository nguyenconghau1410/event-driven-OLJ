package com.example.oj.repository;

import com.example.oj.document.TopicDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface TopicRepository extends MongoRepository<TopicDocument, String> {
    TopicDocument insert(TopicDocument topicDocument);

    Optional<TopicDocument> findByCode(String code);
    List<TopicDocument> findAll();
}
