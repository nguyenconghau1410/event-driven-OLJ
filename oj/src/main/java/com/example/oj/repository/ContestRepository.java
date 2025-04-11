package com.example.oj.repository;

import com.example.oj.document.ContestDocument;
import com.example.oj.dto.Participant;
import com.example.oj.dto.Statistic;
import com.example.oj.dto.StatisticContest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContestRepository extends MongoRepository<ContestDocument, String> {
    ContestDocument insert(ContestDocument contestDocument);
    Page<ContestDocument> findByCreatedBy(String email, Pageable pageable);
    Page<ContestDocument> findByStateAndIsFinished(String state, boolean isFinished, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'isFinished': false, " +
                    "  '$expr': { '$lt': [ " +
                    "    { '$dateFromString': { " +
                    "        'dateString': { '$concat': ['$endTime', 'T', '$hourEnd', ':00'] }, " +
                    "        'format': '%Y-%m-%dT%H:%M:%S' " +
                    "    } }, " +
                    "    '$$NOW' ] } } }"
    })
    List<ContestDocument> search();

    Page<ContestDocument> findByParticipants(Participant email, Pageable pageable);
    Integer countByStateAndIsFinished(String state, boolean isFinished);
    Integer countByCreatedBy(String email);

    Integer countByParticipants(Participant participant);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$createdBy', quantity: { $sum: 1 } } }",
            "{ $skip: ?0 }", "{ $limit: 12 }"
    })
    List<Statistic> getContestOfCreator(int skip);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$createdBy' } }",
            "{ $count: 'total' }"
    })
    StatisticContest countContestOfCreator();
    @Aggregation(pipeline = {
        "{ $match: { createdBy: ?0 } }",
        "{ $addFields: { total: { $size: '$participants' } } }",
        "{ $sort: { total: 1 } }", "{ $skip: ?1 }", "{ $limit: 12 }"
    })
    List<ContestDocument> getContestsCreator(String email, int skip);
}
