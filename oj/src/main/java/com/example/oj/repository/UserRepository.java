package com.example.oj.repository;

import com.example.oj.document.UserDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends MongoRepository<UserDocument, String> {
    UserDocument insert(UserDocument userDocument);
    UserDocument findOneByEmail(String email);

    Optional<UserDocument> findByEmail(String email);

    @Aggregation(pipeline = {
            "{ $sort: { loginAt: 1 } }",
            "{ $skip: ?0 }",
            "{ $limit: 12 }"
    })
    List<UserDocument> getUsers(int skip);

    Page<UserDocument> findByNameContaining(String keyword, Pageable pageable);
    Integer countByNameContaining(String keyword);
}
