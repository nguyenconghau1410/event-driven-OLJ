package com.example.oj.repository;

import com.example.oj.document.DetailContest;
import com.example.oj.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DetailContestRepository extends MongoRepository<DetailContest, String> {
    DetailContest insert(DetailContest detailContest);
    Optional<DetailContest> findById(String id);
    Page<DetailContest> findByContestId(String contestId, Pageable pageable);

    Integer countByContestId(String contestId);
    Page<DetailContest> findByContestIdAndUserId(String contestId, String userId, Pageable pageable);

    Integer countByContestIdAndUserId(String contestId, String userId);
    Page<DetailContest> findByContestIdAndProblemId(String contestId, String problemId, Pageable pageable);

    Integer countByContestIdAndProblemId(String contestId, String problemId);
    void deleteByContestId(String contestId);
    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0 } }",
            "{ $addFields: { parsedDate: { $dateFromString: { dateString: { $substr: ['$createdAt', 0, 23] } } } } }",
            "{ $sort: { problemId: 1, point: -1, createAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: { problemId: '$problemId', userId: '$userId' }, document: { $first: '$$ROOT' } } }",
            "{ $group: { _id: '$document.userId', name: { $first: '$document.name' }, totalScore: { $sum: '$document.point' }, totalSolutions: { $sum: { $cond: { if: { $ne: ['$document.point', 0] }, then: 1, else: 0 } } }, totalSeconds: { $sum: { $add: [{ $divide: [{ $toLong: '$document.parsedDate' }, 3600000] }] } } } }",
            "{ $sort: { totalScore: -1, totalSolutions: -1, totalSeconds: 1 } }",
            "{ $skip: ?1 }",
            "{ $limit: 30 }"
    })
    List<LeaderBoard> getLeaderBoard(String contestId, Integer pageNumber);

    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0 } }",
            "{ $addFields: { parsedDate: { $dateFromString: { dateString: { $substr: ['$createdAt', 0, 23] } } } } }",
            "{ $sort: { problemId: 1, point: -1, createAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: { problemId: '$problemId', userId: '$userId' }, document: { $first: '$$ROOT' } } }",
            "{ $group: { _id: '$document.userId', name: { $first: '$document.name' }, totalScore: { $sum: '$document.point' }, totalSolutions: { $sum: { $cond: { if: { $ne: ['$document.point', 0] }, then: 1, else: 0 } } }, totalSeconds: { $sum: { $add: [{ $divide: [{ $toLong: '$document.parsedDate' }, 3600000] }] } } } }",
            "{ $sort: { totalScore: -1, totalSolutions: -1, totalSeconds: 1 } }",
            "{ $group: { _id: null, rankings: { $push: { _id: '$_id', name: '$name', totalScore: '$totalScore', totalSolutions: '$totalSolutions' } } } }",
            "{ $addFields: { index: { $indexOfArray: [ '$rankings._id', ?1 ] } } }",
            "{ $project: { _id: 0, index: { $indexOfArray: [ '$rankings._id', ?1 ] }, info: { $arrayElemAt: [ '$rankings', '$index' ] } } }"
    })
    TopRating getTopRating(String contestId, String userId);

    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0, userId: ?1 }}",
            "{ $sort: { problemId: 1, point: -1, createAt: 1, time: 1, memory: 1 } }",
            "{ $group: { _id: { problemId: '$problemId' }, document: { $first: '$$ROOT' } } }"
    })
    List<DetailLeaderboard> getDetailLeaderBoard(String contestId, String userId);

    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0 }}",
            "{ $group: { _id: '$userId' } }",
            "{ $count: 'total' }"
    })
    StatisticContest countLeaderBoard(String contestId);

    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0 }}",
            "{ $group: { _id: '$userId', contestId: { $first: '$contestId' }, total: { $sum: 1 } } }",
            "{ $group: { _id: '$contestId', count: { $sum: 1 }, total: { $sum: '$total' } } }"
    })
    StatisticContest getStatisticNumber(String contestId);

    @Aggregation(pipeline = {
            "{ $match: { contestId: ?0 }}",
            "{ $group: { _id: '$result', quantity: { $sum: 1 } } }",
            "{ $sort: { _id: 1 } }"
    })
    List<Statistic> getStatisticBoard(String contestId);
}
