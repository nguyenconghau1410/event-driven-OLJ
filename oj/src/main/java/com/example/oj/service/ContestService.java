package com.example.oj.service;

import com.example.oj.document.ContestDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.Participant;
import com.example.oj.dto.Statistic;
import com.example.oj.dto.StatisticContest;
import com.example.oj.repository.ContestRepository;
import com.example.oj.repository.DetailContestRepository;
import com.example.oj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.MongoExpression;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ContestService {
    private final ContestRepository contestRepository;
    private final UserRepository userRepository;
    private final DetailContestRepository detailContestRepository;
    private final MongoTemplate mongoTemplate;
    public ContestDocument insert(ContestDocument contestDocument) {
        contestDocument.setState("PRIVATE");
        return contestRepository.insert(contestDocument);
    }

    public List<ContestDocument> getOne(String email, Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());
        return contestRepository.findByCreatedBy(email, pageable).getContent();
    }

    public ContestDocument findOne(String id) {
        return contestRepository.findById(id).get();
    }

    public void update(ContestDocument contestDocument) {
        contestRepository.save(contestDocument);
    }

    public List<ContestDocument> getContestList(boolean isFinished, Integer pageNumber) {
        String jsonQuery = """
                            {
                              "isFinished": false,
                              "$expr": {
                                "$lt": [
                                  {
                                    "$dateFromString": {
                                      "dateString": {
                                        "$concat": ["$endTime", "T", "$hourEnd", ":00"]
                                      },
                                      "format": "%Y-%m-%dT%H:%M:%S"
                                    }
                                  },
                                  "$$NOW"
                                ]
                              }
                            }
                            """;

        BasicQuery query = new BasicQuery(Document.parse(jsonQuery));
        Update update = new Update().set("isFinished", true);
        mongoTemplate.updateMulti(query, update, ContestDocument.class);
        Pageable pageable;
        if(isFinished) {
            pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());
        }
        else {
            pageable = PageRequest.of(pageNumber, 10, Sort.by("startTime"));
        }
        Page<ContestDocument> page = contestRepository.findByStateAndIsFinished("PUBLIC", isFinished, pageable);
        if(page != null)
            return page.getContent();
        return new ArrayList<>();
    }

    public Map<String, Integer> countContestList(boolean isFinished) {
        Integer total = contestRepository.countByStateAndIsFinished("PUBLIC", isFinished);
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", total);
        return mp;
    }

    public Map<String, Integer> countByCreatedBy(String email) {
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", contestRepository.countByCreatedBy(email));
        return mp;
    }

    public List<ContestDocument> getHistoryContest(String email, Integer pageNumber) {
        Participant participant = new Participant();
        participant.setEmail(email);
        participant.setJoined(true);
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("endTime").descending());
        Page<ContestDocument> page = contestRepository.findByParticipants(participant, pageable);
        if (page != null)
            return page.getContent();
        return new ArrayList<>();
    }

    public Map<String, Integer> countHistoryContest(String email) {
        Participant participant = new Participant();
        participant.setEmail(email);
        participant.setJoined(true);
        Map<String, Integer> mp = new HashMap<>();
        Integer total = contestRepository.countByParticipants(participant);
        if(total == null) {
            total = 0;
        }
        mp.put("total", total);
        return mp;
    }

    //administration
    public List<Map<String, Object>> getContestOfCreator(int pageNumber) {
        List<Statistic> data = contestRepository.getContestOfCreator(pageNumber * 12);
        List<Map<String, Object>> list = new ArrayList<>();
        for(Statistic statistic : data) {
            Optional<UserDocument> userDocument = userRepository.findByEmail(statistic.getId());
            if(userDocument.isPresent()) {
                Map<String, Object> mp = new HashMap<>();
                mp.put("user", userDocument.get());
                mp.put("quantity", statistic.getQuantity());
                list.add(mp);
            }
        }
        return list;
    }

    public Map<String, Integer> countContestOfCreator() {
        Map<String, Integer> mp = new HashMap<>();
        StatisticContest data = contestRepository.countContestOfCreator();
        if(data.getTotal() != 0 && data.getTotal() != null) {
            mp.put("total", Math.toIntExact(data.getTotal()));
        }
        else {
            mp.put("total", 0);
        }
        return mp;
    }

    public List<Map<String, Object>> getContestsCreator(String email, int pageNumber) {
        List<ContestDocument> contestDocuments = contestRepository.getContestsCreator(email, pageNumber * 12);
        List<Map<String, Object>> data = new ArrayList<>();
        for (ContestDocument contestDocument: contestDocuments) {
            Map<String, Object> mp = new HashMap<>();
            mp.put("contest", contestDocument);
            Integer count = detailContestRepository.countByContestId(contestDocument.getId());
            mp.put("submissions", count);
            data.add(mp);
        }
        return data;
    }

    public Map<String, String> deleteContest(String email, String contestId) {
        Optional<ContestDocument> contestDocument = contestRepository.findById(contestId);
        Optional<UserDocument> userDocument = userRepository.findByEmail(email);
        if (contestDocument.isPresent() && userDocument.isPresent()) {
            Map<String, String> mp = new HashMap<>();
            if(userDocument.get().getRole().getCode().equals("ADMIN") || contestDocument.get().getCreatedBy().equals(email)) {
                contestRepository.deleteById(contestId);
                detailContestRepository.deleteByContestId(contestId);
                mp.put("result", "success");
            }
            else {
                mp.put("result", "error");
            }
            return mp;
        }
        return null;
    }
}
