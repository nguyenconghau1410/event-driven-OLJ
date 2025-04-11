package com.example.oj.repository;

import com.example.oj.document.SubmissionDocument;
import com.example.oj.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionRepository extends MongoRepository<SubmissionDocument, String> {
    SubmissionDocument insert(SubmissionDocument submissionDocument);
//    List<SubmissionDocument> findByProblemIdAndUserId(String problemId, String userId);

    Page<SubmissionDocument> findByProblemIdAndUserId(String problemId, String userId, Pageable pageable);
    Page<SubmissionDocument> findByProblemId(String problemId, Pageable pageable);

    Page<SubmissionDocument> findAll(Pageable pageable);

    Page<SubmissionDocument> findByUserId(String userId, Pageable pageable);
    void deleteByProblemId(String problemId);
    void deleteByProblemIdAndResultNot(String problemId, String result);
    Integer countByProblemId(String problemId);
    Integer countByProblemIdAndUserId(String problemId, String userId);

    Integer countByUserId(String userId);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$result', quantity: { $sum: 1 } } }",
            "{ $sort: { _id: 1 } }"
    })
    List<Statistic> getStatistic();

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $group: { _id: '$problemId' } }",
            "{ $count: 'total' }"
    })
    StatisticContest getTotalSolved(String userId);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $group: { _id: '$problemId', ac: { $push: '$result' } } }",
            "{ $project: { ac: { $cond: { if: { $in: ['ACCEPTED', '$ac'] }, then: 'AC', else: 'NOT AC' } } } }",
            "{ $group: { _id: '$ac', total: { $sum: { $cond: { if: { $eq: ['AC', '$ac'] }, then: 1, else: 0 } } } } }"
    })
    StatisticContest getTotalAC(String userId);

    @Aggregation(pipeline = {
            "{ $match: { result: 'ACCEPTED' } }",
            "{ $addFields: { parsedDate: { $dateFromString: { dateString: { $substr: ['$createdAt', 0, 23] } } } } }",
            "{ $sort: { createdAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: { problemId: '$problemId', userId: '$userId', }, document: { $first: '$$ROOT' } } }",
            "{ $group: { _id: '$document.userId', totalSolutions: { $sum: 1 }, totalSeconds: { $avg: { $add: [{ $divide: [{ $toLong: '$document.parsedDate' }, 3600000] }] } } } }",
            "{ $sort: { totalSolutions: -1, totalSeconds: 1 } }",
            "{ $skip: ?0 }", "{ $limit: 25 }"
    })
    List<LeaderBoard> getLeaderboardUser(int skip);

    @Aggregation(pipeline = {
            "{ $match: { result: 'ACCEPTED' } }",
            "{ $group: { _id: '$userId' } }",
            "{ $count: 'total' }"
    })
    StatisticContest countAllUser();

    @Aggregation(pipeline = {
            "{ $match: { problemId: ?0 } }",
            "{ $group: { _id: '$problemId', total: { $sum: 1 }, totalAC: { $sum: { $cond: { if: { $eq: ['$result', 'ACCEPTED'] }, then: 1, else: 0 } } } } }"
    })
    ProblemSmall getStatisticProblem(String problemId);
    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, result: 'ACCEPTED' } }",
            "{ $sort: { createdAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: '$problemId', submission: { $first: '$$ROOT' } } }",
            "{ $sort: { 'document.createdAt': -1 } }",
            "{ $skip: ?1 }",
            "{ $limit: 10 }"
    })
    List<DetailLeaderboard> getACList(String userId, int skip);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, result: 'ACCEPTED' } }",
            "{ $group: { _id: '$problemId' } }",
            "{ $count: 'total' }"
    })
    StatisticContest countACList(String userId);

    @Aggregation(pipeline = {
            "{ $match: { result: 'ACCEPTED' } }",
            "{ $addFields: { parsedDate: { $dateFromString: { dateString: { $substr: ['$createdAt', 0, 23] } } } } }",
            "{ $sort: { createdAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: { problemId: '$problemId', userId: '$userId', }, document: { $first: '$$ROOT' } } }",
            "{ $group: { _id: '$document.userId', totalSolutions: { $sum: 1 }, totalSeconds: { $avg: { $add: [{ $divide: [{ $toLong: '$document.parsedDate' }, 3600000] }] } } } }",
            "{ $sort: { totalSolutions: -1, totalSeconds: 1 } }",
            "{ $group: { _id: null, rankings: { $push: { _id: '$_id' } } } }",
            "{ $project: { _id: 0, index: { $indexOfArray: [ '$rankings._id', ?0 ] } } }"
    })
    TopRating getTopRatingUser(String userId);
}
