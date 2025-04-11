package com.example.oj.repository;

import com.example.oj.document.RoleDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<RoleDocument, String> {
    RoleDocument insert(RoleDocument roleDocument);
    RoleDocument findOneByCode(String code);
}
