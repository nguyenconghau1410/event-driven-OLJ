package com.example.oj.repository;

import com.example.oj.document.ProblemDocument;
import com.example.oj.dto.PageResponse;
import com.example.oj.dto.ProblemSmall;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProblemRepository extends MongoRepository<ProblemDocument, String> {
    ProblemDocument insert(ProblemDocument problemDocument);
    Integer countByState(String state);
    Page<ProblemDocument> findAllByState(String state, Pageable pageable);

    Page<ProblemDocument> findAllByEmail(String email, Pageable pageable);

    Page<ProblemDocument> findAll(Pageable pageable);
    Integer countByEmail(String email);
    List<ProblemDocument> findByTitleContaining(String keyword);
    Page<ProblemDocument> findByTitleContaining(String keyword, Pageable pageable);

    Integer countByTitleContaining(String keyword);

    @Aggregation(pipeline = {
            "{ $match: { " +
                    "$and: [ " +
                    "{ $or: [ { 'title': { $regex: ?0, $options: 'i' } } ] }, " +
                    "{ $or: [ { 'difficulty': { $regex: ?1, $options: 'i' } } ] } " +
                    "] " +
                    "} }",

            "{ $lookup: { " +
                    "from: 'topic_problem', " +
                    "localField: '_id', " +
                    "foreignField: 'problemId', " +
                    "as: 'topicProblem' " +
                    "} }",

            "{ $unwind: '$topicProblem' }",

            "{ $lookup: { " +
                    "from: 'topic', " +
                    "let: { topicIdStr: { $toObjectId: '$topicProblem.topicId' } }, " +
                    "pipeline: [ " +
                    "{ $match: { $expr: { $eq: ['$_id', '$$topicIdStr'] } } } " +
                    "], " +
                    "as: 'topicInfo' " +
                    "} }",

            "{ $unwind: '$topicInfo' }",

            "{ $match: { " +
                    "$or: [ { 'topicInfo.code': { $regex: ?2, $options: 'i' } } ] " +
                    "} }",

            "{ $group: { " +
                    "_id: '$_id', " +
                    "title: { $first: '$title' }, " +
                    "difficulty: { $first: '$difficulty' } " +
                    "} }",

            "{ $facet: { " +
                    "total: [ { $count: 'totalCount' } ], " +
                    "pagedProblemResults: [ { $skip: ?3 }, { $limit: ?4 } ] " +
                    "} }"
    })
    PageResponse search(
            String keyword,
            String difficulty,
            String topicCode,
            int offset,
            int limit
    );



}
